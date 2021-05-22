import { Box } from '@material-ui/core';
import React from 'react'
import CloseIcon from '@material-ui/icons/Close';

interface IProps {
    changedImages:Array<{id:number,fileURL:string}>,
    deleteImage: (id:number) => void
}

const ChoosedImages:React.FC<IProps> = (props) => {

    return <Box style={{
        display: "flex",
        margin:"-10px 0 0"
    }}>
        {props.changedImages?.map(el => <Box key={el.id + Math.random() * 1000} style = {{
            position:"relative",
            minWidth:'50px',
            maxWidth:'50px',
            minHeight:'50px',
            maxHeight:'50px'
        }}>
                <CloseIcon fontSize = {'small'}
                    onClick = {() => props.deleteImage(el.id)}
                    style = {{
                        position:'absolute',
                        right: "0",
                        background:'black',
                        color:'white',
                    }}
                />
                 <img src={el.fileURL} width={'100%'} height = {'100%'} />
            </Box>
        )}
    </Box>
}



export default ChoosedImages;