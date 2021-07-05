import { Publisher, ExpirationCompleted, Subjects } from '@nawedtickets/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleted> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}
