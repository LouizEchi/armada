export async function context({ event: ctx }: any) {
  const kastle_key = ctx.headers['kasl-key']

  return {
    kastle_key,
  }
}
