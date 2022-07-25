import { useDrag } from 'react-dnd'
export default function Sku({id,parent}){
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'sku',
        item:{id,parent},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
      }),[id])
    return (
        <div className='sku' ref={drag} 
        style={{
            opacity: isDragging ? 0.5 : 1,
        }}>{
             <p>{id}</p>
        }
        {/* {console.log(parent)}          */}
        </div>
    )
}