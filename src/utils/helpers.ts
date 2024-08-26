import { CustomerCallers } from '../types/customerCallers.types'
const ONE_DAY_MS = 24 * 60 * 60 * 1000; // Milliseconds in a day

// Split call into daily segments
function splitCallIntoDailySegments(call: CustomerCallers.customer) {
    const segments = [];
    let currentStart = call.startTimestamp;
    const currentEnd = call.endTimestamp;

    while (currentStart < currentEnd) {
        const startDate = new Date(currentStart).toISOString().split('T')[0];
        const endOfDay = new Date(startDate).getTime() + ONE_DAY_MS;
        const segmentEnd = Math.min(endOfDay, currentEnd);
        
        segments.push({
            customerId: call.customerId,
            callId: call.callId,
            startTimestamp: currentStart,
            endTimestamp: segmentEnd,
            date: startDate
        });

        currentStart = segmentEnd;
    }

    return segments;
}

// Group calls
function groupCallsByCustomerAndDate(data: CustomerCallers.customer[]) : {[key: string]: CustomerCallers.customer[]} {
    const groupedCalls: Record<string, CustomerCallers.customer[]> = {};
    data.forEach(call => {
        const segments = splitCallIntoDailySegments(call);
        segments.forEach(segment => {
            const key = `${segment.customerId}|${segment.date}`;
            groupedCalls[key] = groupedCalls[key] || [];
            groupedCalls[key].push(segment);
        });
    });
    return groupedCalls;
}


// Calculate max concurrent calls
function calculateMaxConcurrentCalls(calls: CustomerCallers.customer[]) {
    if (calls.length === 0) return null;

    const events = calls.flatMap(call => [
        { timestamp: call.startTimestamp, type: 'start', callId: call.callId },
        { timestamp: call.endTimestamp, type: 'end', callId: call.callId }
    ]);

    // Sort events by timestamp; 'end' events come before 'start' if timestamps are equal
    events.sort((a, b) => a.timestamp - b.timestamp || (a.type === 'end' ? -1 : 1));

    let maxConcurrentCalls = 0;
    let currentConcurrentCalls = 0;
    let bestTimestamp = 0;
    const activeCalls =  new Set<string>();;
    let maxCallIds : string[] = [];

    events.forEach(event => {
        if (event.type === 'start') {
            activeCalls.add(event.callId);
            currentConcurrentCalls++;
            if (currentConcurrentCalls > maxConcurrentCalls) {
                maxConcurrentCalls = currentConcurrentCalls;
                bestTimestamp = event.timestamp;
                maxCallIds = Array.from(activeCalls);
            }
        } else {
            activeCalls.delete(event.callId);
            currentConcurrentCalls--;
        }
    });

    return {
        maxConcurrentCalls,
        timestamp: bestTimestamp,
        callIds: maxCallIds
    };
}
// Find concurrent callers for customer by date
export function findConcurrentCallersForCustomerByDate(data: CustomerCallers.customer[]) {
    const results: CustomerCallers.customerCallDetailsPerDay[] = [];
    const callsByCustomerAndDate = groupCallsByCustomerAndDate(data);

    Object.entries(callsByCustomerAndDate).forEach(([key, calls]) => {
        const [customerId, date] = key.split('|');
        const concurrentDetails = calculateMaxConcurrentCalls(calls);
        if (concurrentDetails) {
            results.push({
                customerId: parseInt(customerId),
                date: date,
                maxConcurrentCalls: concurrentDetails.maxConcurrentCalls,
                timestamp: concurrentDetails.timestamp,
                callIds: concurrentDetails.callIds
            });
        }
    });

    return { results };
}