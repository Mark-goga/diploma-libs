export class DateMapUtils {
  static mapCreatedUpdatedAtDateToISOString({
    createdAt,
    updatedAt,
  }: {
    createdAt: Date;
    updatedAt: Date;
  }): { createdAt: string; updatedAt: string } {
    return {
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }
}
