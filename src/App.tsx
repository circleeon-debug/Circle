import { useMemo, useState } from 'react'
import './App.css'

interface Member {
  id: number
  name: string
}

let nextId = 4

const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Grace' },
  { id: 3, name: 'Linus' },
]

function App() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [draft, setDraft] = useState('')

  const canAdd = draft.trim().length > 0

  const addMember = () => {
    const name = draft.trim()
    if (!name) return
    setMembers((prev) => [...prev, { id: nextId++, name }])
    setDraft('')
  }

  const removeMember = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const summary = useMemo(() => {
    if (members.length === 0) return 'Your circle is empty. Add someone to get started.'
    if (members.length === 1) return '1 person in your circle.'
    return `${members.length} people in your circle.`
  }, [members])

  return (
    <main className="app">
      <div className="card">
        <div className="logo" aria-hidden="true" />
        <h1>Circle</h1>
        <p className="tagline">Keep the people who matter close.</p>

        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault()
            addMember()
          }}
        >
          <input
            aria-label="Member name"
            className="input"
            placeholder="Add someone to your circle…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button className="button" type="submit" disabled={!canAdd}>
            Add
          </button>
        </form>

        <p className="summary" data-testid="summary">
          {summary}
        </p>

        <ul className="members">
          {members.map((member) => (
            <li className="member" key={member.id}>
              <span className="avatar" aria-hidden="true">
                {member.name.charAt(0).toUpperCase()}
              </span>
              <span className="member-name">{member.name}</span>
              <button
                className="remove"
                type="button"
                aria-label={`Remove ${member.name}`}
                onClick={() => removeMember(member.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

export default App
