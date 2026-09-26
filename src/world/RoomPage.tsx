import { MISSIONS } from "@/content/missions"
import { ROOMS } from "@/content/world"
import { MissionPlayer } from "@/engine/MissionPlayer"
import { Kicker } from "@/components/site/shared"

export function RoomPage({ id }: { id: string }) {
  const mission = MISSIONS[id]
  const room = ROOMS.find((r) => r.id === id)
  if (!mission || !room) {
    return (
      <section className="py-16">
        <div className="wrap-mid px-5 md:px-10">
          <h1 className="h-section mb-4">That room isn't open yet.</h1>
          <p className="lede">
            <a href="#/">Back to your desk</a>.
          </p>
        </div>
      </section>
    )
  }
  return (
    <section className="tint py-10 md:py-14" aria-labelledby="room-title">
      <div className="wrap-mid px-5 md:px-10">
        <div className="mb-8 grid items-center gap-6 sm:grid-cols-[1fr_minmax(0,300px)]">
          <div>
            <Kicker>{room.name}</Kicker>
            <h1 className="h-section mb-3" id="room-title">
              {mission.title}.
            </h1>
            <p className="lede">{mission.tagline}</p>
          </div>
          <img src={room.image} alt="" width={1200} height={800} className="mx-auto w-full max-w-[300px] rounded-[24px] max-sm:hidden" />
        </div>
        <MissionPlayer key={mission.id} mission={mission} room={room} onExit="#/" />
      </div>
    </section>
  )
}
