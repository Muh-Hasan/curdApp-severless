import React , { useEffect, useState } from "react"

export default function Home() {
  const [data , setData] = useState('')
  useEffect(() => {
    (async () => {
      const fetchedData = await (await fetch('/.netlify/functions/read')).json()
      setData(fetchedData.message)
    })()
  })
  return (
    <div>
      <h1>{data}</h1>
    </div>
  )
}
