export default function SearchBar ()  {
    return (
        <div style={{ width: '100vw', backgroundColor: 'transparent', padding: '10px' , position : 'absolute', top: 0, left: 0, zIndex: 1000 }}>
            <form style={{ padding: '10px'  , display: 'flex', gap: '10px' , justifyContent: 'center'}}>
                <input type={'text'} placeholder={'repo url'}/>
                <input type={'text'} placeholder={'file type'}/>
                <button type={'submit'}>Submit</button>

            </form>
        </div>
    )
}
