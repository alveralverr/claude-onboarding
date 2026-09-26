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
            <a href="#/">Back to the office</a>.
          </p>
        </div>
      </section>
    )
  }
  return (
    <section className="tint py-10 md:py-14" aria-labelledby="room-title">
      <div className="wrap-mid px-5 md:px-10">
        <Kicker>{room.name}</Kicker>
        <h1 className="h-section mb-3" id="room-title">
          {mission.title}.
        </h1>
        <p className="lede mb-8">{mission.tagline}</p>
        <MissionPlayer key={mission.id} mission={mission} room={room} onExit="#/" />
      </div>
    </section>
  )
}
