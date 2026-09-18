import { Request, Response } from "express";
import Member from "../models/Member";
import Event from "../models/events";
import Recruitment from "../models/recruitments";
import Registration from "../models/Registration";
import Contact from "../models/Contact";
import Application from "../models/Application";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    /* ---------------- DATE SETUP ---------------- */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    /* ---------------- MEMBERS ---------------- */
    const totalMembers = await Member.countDocuments();

    const todayMembers = await Member.countDocuments({
      createdAt: { $gte: today }
    });

    const yesterdayMembers = await Member.countDocuments({
      createdAt: { $gte: yesterday, $lt: today }
    });

    const memberGrowthRate =
      yesterdayMembers > 0
        ? Math.round(((todayMembers - yesterdayMembers) / yesterdayMembers) * 100)
        : todayMembers > 0 ? 100 : 0;

    const recentMembers = await Member.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt")
      .lean();

    /* ---------------- EVENTS ---------------- */
    const events = await Event.find({ display: true })
      .select("name date time venue contactPersons isClosed createdAt")
      .lean();

    const registrationsByEvent = await Registration.aggregate([
      {
        $group: {
          _id: "$eventId",
          count: { $sum: 1 },
          todayCount: {
            $sum: { $cond: [{ $gte: ["$createdAt", today] }, 1, 0] }
          },
          yesterdayCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", yesterday] },
                    { $lt: ["$createdAt", today] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const registrationMap = new Map<string, any>();
    registrationsByEvent.forEach(r => {
      registrationMap.set(r._id.toString(), r);
    });

    let ongoingEvents = 0;
    let upcomingEvents = 0;
    let todayRegistrations = 0;
    let mostPopularEvent: { name: string; registrations: number } | null = null;
    const upcomingList: any[] = [];

    events.forEach(event => {
      const eventDate = new Date(event.date);
      const regData = registrationMap.get(event._id.toString());
      const regCount = regData?.count || 0;
      const todayReg = regData?.todayCount || 0;

      todayRegistrations += todayReg;

      if (!mostPopularEvent || regCount > mostPopularEvent.registrations) {
        mostPopularEvent = { name: event.name, registrations: regCount };
      }

      if (!event.isClosed && eventDate.getTime() === today.getTime()) {
        ongoingEvents++;
      } else if (!event.isClosed && eventDate > today) {
        upcomingEvents++;
        upcomingList.push(event);
      }
    });

    const latestEvent = upcomingList.length
      ? upcomingList.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )[0]
      : null;

    const yesterdayRegTotal = registrationsByEvent.reduce(
      (sum, r) => sum + (r.yesterdayCount || 0),
      0
    );

    const registrationRate =
      yesterdayRegTotal > 0
        ? Math.round(((todayRegistrations - yesterdayRegTotal) / yesterdayRegTotal) * 100)
        : todayRegistrations > 0 ? 100 : 0;

    /* ---------------- RECRUITMENTS (WITH APPLICATION COUNT) ---------------- */
    const recruitmentStats = await Application.aggregate([
      {
        $group: {
          _id: "$recruitmentId",
          count: { $sum: 1 }
        }
      }
    ]);

    const recruitmentCountMap = new Map<string, number>();
    recruitmentStats.forEach(r => {
      recruitmentCountMap.set(r._id.toString(), r.count);
    });

    const ongoingRecruitments = await Recruitment.find({ isOpen: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("title role createdAt endDate")
      .lean();

    let topRecruitment: { title: string; applicants: number } | null = null;

    const ongoingRecruitmentsWithCount = ongoingRecruitments.map(rec => {
      const count = recruitmentCountMap.get(rec._id.toString()) || 0;

      if (!topRecruitment || count > topRecruitment.applicants) {
        topRecruitment = {
          title: rec.title,
          applicants: count
        };
      }

      return {
        _id: rec._id.toString(),
        title: rec.title,
        role: rec.role,
        createdAt: rec.createdAt,
        applicantCount: count,
        deadline: rec.endDate?.toISOString() || ""
      };
    });

    /* ---------------- CONTACT NOTIFICATIONS ---------------- */
    const unreadContacts = await Contact.find({ isRead: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("Firstname Lastname Message createdAt isRead")
      .lean();

    const contactNotifications = unreadContacts.map(c => ({
      _id: c._id.toString(),
      type: "contact_message" as const,
      title: `${c.Firstname} ${c.Lastname}`,
      subtitle:
        c.Message.length > 40 ? c.Message.slice(0, 40) + "..." : c.Message,
      time: c.createdAt,
      isRead: c.isRead
    }));

    /* ---------------- RECENT ACTIVITY ---------------- */
    const recentEvents = (await Event.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name createdAt")
      .lean()).map(e => ({
        _id: e._id.toString(),
        type: "event_created" as const,
        title: e.name,
        subtitle: "Event scheduled",
        time: e.createdAt
      }));

    const recentRecruitments = (await Recruitment.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("title role createdAt")
      .lean()).map(r => ({
        _id: r._id.toString(),
        type: "recruitment_opened" as const,
        title: r.title,
        subtitle: `Role: ${r.role}`,
        time: r.createdAt
      }));

    const recentMembersActivity = recentMembers.map(m => ({
      _id: m._id.toString(),
      type: "member_joined" as const,
      title: m.name || "New Member",
      subtitle: "Joined the chapter",
      time: m.createdAt
    }));

    const recentActivity = [
      ...contactNotifications,
      ...recentEvents,
      ...recentRecruitments,
      ...recentMembersActivity
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 6)
      .map(a => ({
        ...a,
        time: a.time instanceof Date ? a.time.toISOString() : a.time
      }));

    /* ---------------- SYSTEM HEALTH ---------------- */
    const systemHealth = {
      apiStatus: "online" as const,
      dbStatus: "connected" as const,
      lastSync: new Date().toISOString(),
      uptime: "99.9%"
    };

    /* ---------------- RESPONSE ---------------- */
    res.status(200).json({
      stats: {
        totalMembers,
        totalEvents: events.length,
        ongoingEvents,
        upcomingEvents,
        todayRegistrations,
        registrationRate,
        memberGrowthRate
      },
      latestEvent: latestEvent
        ? {
            _id: latestEvent._id.toString(),
            name: latestEvent.name,
            date: latestEvent.date,
            time: latestEvent.time,
            venue: latestEvent.venue,
            contactPersons: latestEvent.contactPersons || [],
            totalRegistrations:
              registrationMap.get(latestEvent._id.toString())?.count || 0
          }
        : null,
      ongoingRecruitments: ongoingRecruitmentsWithCount,
      recentActivity,
      topPerformers: {
        topEvent: mostPopularEvent,
        topRecruitment
      },
      systemHealth
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

export const syncDashboardData = async (_: Request, res: Response) => {
  res.status(200).json({
    message: "Dashboard synced",
    timestamp: new Date().toISOString()
  });
};

export const markContactAsRead = async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    contact.isRead = !contact.isRead;
    await contact.save();

    res.status(200).json({
      success: true,
      message: contact.isRead ? "Marked as read" : "Marked as unread",
      isRead: contact.isRead,
      id: contact._id
    });
  } catch (error) {
    console.error("Toggle read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message status"
    });
  }
};
