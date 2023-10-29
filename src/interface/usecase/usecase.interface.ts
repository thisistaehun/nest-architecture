export interface IUsecase<I, O> {
  execute(input: I, args?: any): Promise<O>;
}
