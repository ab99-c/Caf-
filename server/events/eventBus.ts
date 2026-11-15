/**
 * Layer 5: Message Queue / Event Bus (RabbitMQ / Kafka Broker)
 * Aligned with Qahwati Enterprise Architecture
 */

export type EventTopic =
  | "order.created"
  | "payment.processed"
  | "invoice.issued"
  | "ai.fraud_detected"
  | "ai.audit_passed"
  | "notification.dispatched";

export interface SystemEvent<T = any> {
  id: string;
  topic: EventTopic;
  timestamp: string;
  correlationId: string;
  payload: T;
}

export class EventBroker {
  private static subscribers: Map<EventTopic, ((event: SystemEvent) => void)[]> = new Map();

  static publish<T>(topic: EventTopic, payload: T, correlationId: string = `corr_${Date.now()}`): SystemEvent<T> {
    const event: SystemEvent<T> = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      topic,
      timestamp: new Date().toISOString(),
      correlationId,
      payload,
    };

    const listeners = this.subscribers.get(topic) || [];
    listeners.forEach((fn) => {
      try {
        fn(event);
      } catch (err) {
        console.error(`[EventBroker] Error in subscriber for topic ${topic}:`, err);
      }
    });

    return event;
  }

  static subscribe(topic: EventTopic, handler: (event: SystemEvent) => void) {
    const list = this.subscribers.get(topic) || [];
    list.push(handler);
    this.subscribers.set(topic, list);
  }
}
