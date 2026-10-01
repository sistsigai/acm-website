import axiosInstance from "../services/axiosInstance";

export interface QueuedScan {
  id: string;
  eventId: string;
  qrData: string;
  scannedAt: string;
  synced: boolean;
}

const STORAGE_KEY = "sigai_scanner_offline_queue";

class ScannerOfflineQueue {
  /**
   * Get all queued scans from local storage
   */
  public getQueue(): QueuedScan[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Add a new scan to the offline queue
   */
  public enqueue(eventId: string, qrData: string): QueuedScan {
    const queue = this.getQueue();
    const newScan: QueuedScan = {
      id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      eventId,
      qrData,
      scannedAt: new Date().toISOString(),
      synced: false,
    };

    queue.push(newScan);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
    return newScan;
  }

  /**
   * Get count of pending scans for a specific event
   */
  public getPendingCount(eventId?: string): number {
    const queue = this.getQueue();
    if (eventId) {
      return queue.filter((item) => item.eventId === eventId && !item.synced).length;
    }
    return queue.filter((item) => !item.synced).length;
  }

  /**
   * Clear all synced or specific event items from the queue
   */
  public clear(eventId?: string) {
    if (eventId) {
      const queue = this.getQueue().filter((item) => item.eventId !== eventId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Synchronize queued scans with the backend batch API
   */
  public async syncQueue(eventId: string): Promise<{ success: boolean; syncedCount: number; message: string }> {
    const queue = this.getQueue();
    const pendingScans = queue.filter((item) => item.eventId === eventId && !item.synced);

    if (pendingScans.length === 0) {
      return { success: true, syncedCount: 0, message: "No pending scans to sync." };
    }

    try {
      const payload = {
        scans: pendingScans.map((s) => ({
          qrData: s.qrData,
          scannedAt: s.scannedAt,
        })),
      };

      const response = await axiosInstance.post<{ success: boolean; message: string; results: any[] }>(
        `/events/${eventId}/attendance/batch-scan`,
        payload
      );

      if (response.data && response.data.success) {
        // Remove synced items from local queue
        const pendingIds = new Set(pendingScans.map((s) => s.id));
        const remainingQueue = queue.filter((item) => !pendingIds.has(item.id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingQueue));

        return {
          success: true,
          syncedCount: pendingScans.length,
          message: response.data.message || `Successfully synced ${pendingScans.length} scans!`,
        };
      } else {
        return {
          success: false,
          syncedCount: 0,
          message: response.data.message || "Failed to sync offline scans",
        };
      }
    } catch (err: any) {
      console.error("Failed to batch sync offline scans:", err);
      return {
        success: false,
        syncedCount: 0,
        message: err.message || "Network error while syncing scans",
      };
    }
  }
}

export const scannerQueue = new ScannerOfflineQueue();
