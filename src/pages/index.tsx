import React, { useEffect, useState } from "react"
import { Form, Formik, Field } from "formik"

export default function Home() {
  interface Data {
    ref: object
    ts: number
    data: {
      message: string
    }
  }
  interface Update{
    ref : object,
    ts: number,
    data :object
  }
  const [data, setData] = useState<null | Data[]>()
  const [fetchData, setFetchData] = useState(false)
  const [updatingData, setUpdatingData] = useState<null | Update>()
  const [update, setUpdate] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      await fetch("/.netlify/functions/read")
        .then(res => res.json())
        .then(data => {
          console.log(data)

          setData(data)
        })
    })()
  }, [fetchData])

  const updateMessage = (id: string) => {
    var updateData = data.filter(mes => mes.ref["@ref"].id === id)
    setUpdate(true)
    setUpdatingData(updateData)
  }
  const deleteMessage = async message => {
    setLoading(true)
    await fetch("/.netlify/functions/delete", {
      method: "post",
      body: JSON.stringify({ id: message.ref["@ref"].id }),
    })
    setFetchData(true)
    setLoading(false)
  }
  console.log(updatingData);
  
  
  return (
    <div>
      <div>
        <h2>CURD APP</h2>
      </div>
      <div>
        <Formik
          onSubmit={(value, actions) => {
            if (update) {
              fetch("/.netlify/functions/update", {
                method: "put",
                body: JSON.stringify(value),
              })
              setUpdate(false)
            } else {
              fetch("/.netlify/functions/create", {
                method: "post",
                body: JSON.stringify(value),
              })
              setFetchData(true)
              actions.resetForm({
                values: {
                  message: '',
                },
              })
              setFetchData(false)
            }
          }}
          initialValues={{
            message: !update ? "" : updatingData[0].data.message,
          }}
        >
          {formik => (
            <Form onSubmit={formik.handleSubmit}>
              <Field
                type="text"
                name="message"
                id="message"
              />
              <button type="submit">{update ? 'update' : 'add'}</button>
            </Form>
          )}
        </Formik>
      </div>
      {data === null || data === undefined ? (
        <div>
          <h5>loading...</h5>
        </div>
      ) : (
        <div>
          {data.map((mes, i) => (
            <div key={i}>
              <p>{mes.data.message}</p>
              <button
                onClick={() => {
                  updateMessage(mes.ref["@ref"].id)
                }}
              >
                update
              </button>
              <button
                onClick={() => {
                  deleteMessage(mes)
                }}
              >
                del
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
