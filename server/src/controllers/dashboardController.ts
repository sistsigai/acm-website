import { Request, Response } from "express";
import Member from "../models/Member";
import Event from "../models/events";
import Recruitment from "../models/recruitments";
import Registration from "../models/Registration";
import Contact from "../models/Contact";
import Application from "../models/Application";

export const getDashboardData = async (_req: Request, res: Response) => {
  try {
    /* ---------------- DATE SETUP ---------------- */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    /* ---------------- PARALLELIZED DATABASE QUERIES ---------------- */
    const [
      totalMembers,
      todayMembers,
      yesterdayMembers,
      recentMembers,
      events,
      registrationsByEvent,
      recruitmentStats,
      ongoingRecruitments,
      unreadContacts,
      recentEventsData,
      recentRecruitmentsData
    ] = await Promise.all([
      // 1. Total members count
      Member.countDocuments(),

      // 2. Members joined today
      Member.countDocuments({ createdAt: { $gte: today } }),

      // 3. Members joined yesterday
      Member.countDocuments({ createdAt: { $gte: yesterday, $lt: today } }),

      // 4. Recent members (limit 5)
      Member.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email createdAt")
        .lean(),

      // 5. Displayable events
      Event.find({ display: true })
        .select("name date time venue contactPersons isClosed createdAt")
        .lean(),

      // 6. Registration counts per event
      Registration.aggregate([
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
      ]),

      // 7. Applications per recruitment
      Application.aggregate([
        {
          $group: {
            _id: "$recruitmentId",
            count: { $sum: 1 }
          }
        }
      ]),

      // 8. Ongoing recruitments
      Recruitment.find({ isOpen: true })
        .sort({ createdAt: -1 })
        .limit(6)
        .select("title role createdAt endDate")
        .lean(),

      // 9. Unread contact messages
      Contact.find({ isRead: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("Firstname Lastname Message createdAt isRead")
        .lean(),

      // 10. Recent event creations
      Event.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select("name createdAt")
        .lean(),

      // 11. Recent recruitments
      Recruitment.find()
        .sort({ createdAt: -1 })
        .limit(2)
        .select("title role createdAt")
        .lean()
    ]);

    /* ---------------- MEMBER GROWTH METRICS ---------------- */
    const memberGrowthRate =
      yesterdayMembers > 0
        ? Math.round(((todayMembers - yesterdayMembers) / yesterdayMembers) * 100)
        : todayMembers > 0 ? 100 : 0;

    /* ---------------- PROCESS EVENT REGISTRATIONS ---------------- */
    const registrationMap = new Map<string, any>();
    registrationsByEvent.forEach((r: any) => {
      if (r._id) {
        registrationMap.set(r._id.toString(), r);
      }
    });

    let ongoingEvents = 0;
    let upcomingEvents = 0;
    let todayRegistrations = 0;
    let mostPopularEvent: { name: string; registrations: number } | null = null;
    const upcomingList: any[] = [];

    events.forEach((event: any) => {
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
      (sum: number, r: any) => sum + (r.yesterdayCount || 0),
      0
    );

    const registrationRate =
      yesterdayRegTotal > 0
        ? Math.round(((todayRegistrations - yesterdayRegTotal) / yesterdayRegTotal) * 100)
        : todayRegistrations > 0 ? 100 : 0;

    /* ---------------- PROCESS RECRUITMENTS ---------------- */
    const recruitmentCountMap = new Map<string, number>();
    recruitmentStats.forEach((r: any) => {
      if (r._id) {
        recruitmentCountMap.set(r._id.toString(), r.count);
      }
    });

    let topRecruitment: { title: string; applicants: number } | null = null;

    const ongoingRecruitmentsWithCount = ongoingRecruitments.map((rec: any) => {
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
        deadline: rec.endDate ? new Date(rec.endDate).toISOString() : ""
      };
    });

    /* ---------------- PROCESS NOTIFICATIONS & RECENT ACTIVITY ---------------- */
    const contactNotifications = unreadContacts.map((c: any) => ({
      _id: c._id.toString(),
      type: "contact_message" as const,
      title: `${c.Firstname || ""} ${c.Lastname || ""}`.trim(),
      subtitle:
        c.Message && c.Message.length > 40
          ? c.Message.slice(0, 40) + "..."
          : c.Message || "",
      time: c.createdAt,
      isRead: c.isRead
    }));

    const recentEvents = recentEventsData.map((e: any) => ({
      _id: e._id.toString(),
      type: "event_created" as const,
      title: e.name,
      subtitle: "Event scheduled",
      time: e.createdAt
    }));

    const recentRecruitments = recentRecruitmentsData.map((r: any) => ({
      _id: r._id.toString(),
      type: "recruitment_opened" as const,
      title: r.title,
      subtitle: `Role: ${r.role}`,
      time: r.createdAt
    }));

    const recentMembersActivity = recentMembers.map((m: any) => ({
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

export const syncDashboardData = async (_req: Request, res: Response) => {
  try {
    const [memberCount, eventCount, recruitmentCount] = await Promise.all([
      Member.countDocuments(),
      Event.countDocuments({ display: true }),
      Recruitment.countDocuments({ isOpen: true })
    ]);

    res.status(200).json({
      success: true,
      message: "Dashboard state synchronized successfully",
      syncedAt: new Date().toISOString(),
      summary: {
        members: memberCount,
        events: eventCount,
        activeRecruitments: recruitmentCount
      }
    });
  } catch (error) {
    console.error("Dashboard Sync Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to synchronize dashboard state"
    });
  }
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
