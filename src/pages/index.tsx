import React, { useEffect, useState } from "react"
import { Form, Formik, Field } from "formik"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import "./index.css"

function rand() {
  return Math.round(Math.random() * 20) - 10
}

function getModalStyle() {
  const top = 50 + rand()
  const left = 50 + rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
)

export default function Home() {
  const classes = useStyles()
  const [data, setData] = useState<null | Data[]>()
  const [fetchData, setFetchData] = useState(false)
  const [updatingData, setUpdatingData] = useState(undefined)
  const [update, setUpdate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modalStyle] = useState(getModalStyle)
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)

  interface Data {
    ref: object
    ts: number
    data: {
      message: string
    }
  }

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
    var updateData = data.find(mes => mes.ref["@ref"].id === id)
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
  console.log(updatingData)
  console.log(update)

  // create modal functions
  const handleOpenCreate = () => {
    setOpenCreate(true)
  }
  const handleCloseCreate = () => {
    setOpenCreate(false)
  }

  // updated modal functions
  const handleOpenUpdated = () => {
    setOpenUpdate(true)
  }
  const handleCloseUpdated = () => {
    setOpenUpdate(false)
  }

  // body of create modal
  const bodyCreate = (
    <div style={modalStyle} className={classes.paper}>
      <Formik
        onSubmit={(value, actions) => {
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
              as={TextareaAutosize}
              rowsMax={40}
              type="text"
              name="message"
              id="message"
            />
            <button type="submit">add</button>
            <button type="button" onClick={handleCloseCreate}>
              close
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )

  // body of update modal
  const bodyUpdate = (
    <div style={modalStyle} className={classes.paper}>
      <Formik
        onSubmit={(value, actions) => {
          fetch("/.netlify/functions/update", {
            method: "put",
            body: JSON.stringify({
              message: value.message,
              id: updatingData.ref["@ref"].id,
            }),
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
          message: updatingData !== undefined ? updatingData.data.message : "",
        }}
      >
        {formik => (
          <Form onSubmit={formik.handleSubmit}>
            <Field
              as={TextareaAutosize}
              rowsMax={40}
              type="text"
              name="message"
              id="message"
            />
            <button type="submit">update</button>
            <button type="button" onClick={handleCloseUpdated}>
              close
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
  return (
    <div className="main">
      <div className="head">
        <h3>CURD APP</h3>
      </div>
      <div className="create-btn">
        <button onClick={handleOpenCreate}>Create Message</button>
      </div>
      <div>
        <Modal
          open={openCreate}
          onClose={handleCloseCreate}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {bodyCreate}
        </Modal>
      </div>
      <div>
        <Modal
          open={openUpdate}
          onClose={handleCloseUpdated}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {bodyUpdate}
        </Modal>
      </div>
      {data === null || data === undefined ? (
        <div>
          <h5>loading...</h5>
        </div>
      ) : (
        <div>
          <div className="data-display">
            {data.map((mes, i) => (
              <div key={i}>
                <p>{mes.data.message}</p>
                <button
                  onClick={() => {
                    handleOpenUpdated()
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
        </div>
      )}
    </div>
  )
}
