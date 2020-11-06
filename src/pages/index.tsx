import React, { useEffect, useState } from "react"
import { Form, Formik, Field } from "formik"

export default function Home() {
  interface Data  {
    ref : object,
    ts: number,
    data : {
      message : string
    }
  }
  const [data, setData] = useState<null | Data[]>()
  const [fetchData , setFetchData] = useState(false)
  useEffect(() => {
    (async () => {
      await fetch("/.netlify/functions/read")
        .then(res => res.json())
        .then(data => {
          console.log(data)

          setData(data)
        })
    })()
  } , [fetchData])
  const updateMessage = (message) => {
    fetch("/.netlify/functions/update", {
      method: "post",
      body: JSON.stringify(message),
    })
    setFetchData(true)
  }
  const deleteMessage = (message) => {
    console.log(message);
    fetch("/.netlify/functions/delete", {
      method: "post",
      body: JSON.stringify({ id: message.ref["@ref"].id }),
    })
  }
  return (
    <div>
      <div>
        <h2>CURD APP</h2>
      </div>
      <div>
        <Formik
          onSubmit={(value, actions) => {
            console.log(value)
            fetch("/.netlify/functions/create", {
              method: "post",
              body: JSON.stringify(value),
            })
            setFetchData(true)
            actions.resetForm({
              values: {
                message: "",
              },
            })
            setFetchData(false)
          }}
          initialValues={{
            message: "",
          }}
        >
          {formik => (
            <Form onSubmit={formik.handleSubmit}>
              <Field
                type="text"
                name="message"
                id="message"
                placeholder="type something..."
              />

              <button type="submit">add</button>
            </Form>
          )}
        </Formik>
      </div>
      {data === null || data === undefined ? (
      <div>
        <h5>loading...</h5>
      </div>) : (
      <div>
        {data.map((mes , i) => (
          <div key={i}>
            <p>{mes.data.message}</p>
            <button onClick={() => {
              updateMessage(mes)
            }}>update</button>
            <button onClick={() => {
              deleteMessage(mes)
            }}>del</button>
          </div>
        ))}
      </div>
      ) }
    </div>
  )
}
