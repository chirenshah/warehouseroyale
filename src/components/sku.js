import { useDrag } from 'react-dnd'
export default function Sku({id,parent,setSku}){
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
        }} onClick={()=> setSku(id)}>{
             <p>{id}</p>
        }
        </div>
    )
}