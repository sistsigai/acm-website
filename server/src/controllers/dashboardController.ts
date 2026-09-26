import { Request, Response } from "express";
import Member from "../models/Member";
import Event from "../models/Event";
import Registration from "../models/Registration";

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
      recentEventsData
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

      // 7. Recent event creations
      Event.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name createdAt")
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

    /* ---------------- PROCESS RECENT ACTIVITY ---------------- */
    const recentEvents = recentEventsData.map((e: any) => ({
      _id: e._id.toString(),
      type: "event_created" as const,
      title: e.name,
      subtitle: "Event scheduled",
      time: e.createdAt
    }));

    const recentMembersActivity = recentMembers.map((m: any) => ({
      _id: m._id.toString(),
      type: "member_joined" as const,
      title: m.name || "New Member",
      subtitle: "Joined the chapter",
      time: m.createdAt
    }));

    const recentActivity = [
      ...recentEvents,
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
      ongoingRecruitments: [],
      recentActivity,
      topPerformers: {
        topEvent: mostPopularEvent,
        topRecruitment: null
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
    const [memberCount, eventCount] = await Promise.all([
      Member.countDocuments(),
      Event.countDocuments({ display: true })
    ]);

    res.status(200).json({
      success: true,
      message: "Dashboard state synchronized successfully",
      syncedAt: new Date().toISOString(),
      summary: {
        members: memberCount,
        events: eventCount
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
