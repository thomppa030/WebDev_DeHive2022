import { Box, IconButton, TextField, Button, Typography, Divider, Card } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutline'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import sectionApi from '../../api/sectionApi'
import taskApi from '../../api/taskApi'

let timer
const timeOut = 500

const KanbanBoard = props => {
  const boardId = props.boardId
  const [data, setData] = useState([])

  useEffect(() => {
    setData(props.data)
  }, [props.data])
  
  const onDragEnd = () => {

  }

  const createTask = async(sectionId) => {
      try {
      const task = await taskApi.create(boardId, { sectionId })
      const newData = [...data]
      const index = newData.findIndex(e => e.id === sectionId)
      newData[index].tasks.unshift(task)
      setData(newData)
    } catch (err) {
      alert(err)
    }
  }

  const createSection = async () => {
    try {
        const section = await sectionApi.create(boardId)
        setData([...data, section])
    } catch (err) {
        alert(err)
    }
  }

  const deleteSection = async (sectionId) => {
    try {
        await sectionApi.delete(boardId, sectionId)
        const newData = [...data].filter(e=>e.id !== sectionId)
        setData(newData)
    } catch (err) {
        alert(err)
    }
  }

  const updateSectionTitle = async (e, sectionId) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    const newData = [...data]
    const index = newData.findIndex(e => e.id === sectionId)
    newData[index].title = newTitle
    setData(newData)
    timer = setTimeout(async () => {
        try {
            await sectionApi.update(boardId, sectionId, {title: newTitle})
        } catch (err) {
            alert(err)
        }
    }, timeOut);
  }

  return (
    <>
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Button onClick={createSection}>
        Add Section
      </Button>
      <Typography variant='body2' fontWeight='700'>
      {data.length} Sections
      </Typography>
    </Box>
    <Divider sx={{margin: '10px 0'}}/>
    <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            width: 'calc(100w-400px)',
            overflowY: 'auto'
        }}>
            {
                data.map(section => (
                    <div key={section.id} style={{width: '300px'}}>
                        <Droppable key={section.id} droppableId={section.id}>
                            {(provided) => (
                                <Box 
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{ width: '300px', padding: '10px', marginRight: '10px'}}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '10px'
                                        }}>
                                            <TextField
                                                value={section.title}
                                                placeholder='Untitled'
                                                variant='outlined'
                                                sx={{
                                                    flexGrow: 1,
                                                    '& .MuiOutlinedInput-input': { padding: 0},
                                                    '& .MuiOutlinedInput-notchedOutline': { border: 'unset'},
                                                    '& .MuiOutlinedInput-root': { fontSize: '1rem', fontWeight: '700' }
                                                }}
                                                onChange={(e) => updateSectionTitle(e, section.id)}
                                            />
                                            <IconButton
                                                variant='outlined'
                                                size='small'
                                                sx={{
                                                    color: 'gray',
                                                    '&:hover': {color: 'green'}
                                                }}
                                                onClick={() => createTask(section.id)}
                                                >
                                                    <AddBoxOutlinedIcon/>
                                            </IconButton>
                                            <IconButton
                                                variant='outlined'
                                                size='small'
                                                sx={{
                                                    color: 'gray',
                                                    '&:hover': {color: 'red'}
                                                }}
                                                onClick={() => deleteSection(section.id)}>
                                                    <DeleteOutlinedIcon/>
                                            </IconButton>
                                        {
                                            section.tasks.map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => {
                                                        <Card
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.droppableProps}
                                                            sx={{
                                                                padding:'10px',
                                                                marginBottom:'10px',
                                                                cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                                                            }}
                                                            >
                                                                <Typography>
                                                                    {task.title === '' ? 'Untitled' : task.title}
                                                                </Typography>                       
                                                            </Card>
                                                    }}
                                                </Draggable>
                                            ))
                                        }
                                        </Box>
                                    </Box>
                            )}
                        </Droppable>
                    </div>
                ))
            }
        </Box>
    </DragDropContext>
    </>
  )
}

export default KanbanBoard