import React, { useRef } from 'react'

const Select = (props) => {
    // console.log(ref)
    const {supportedLanguages, name, language, setLanguage} = props

    function onChangeHandler(e){
        setLanguage(e.target.value);
    }
    
  return (
    <div>
        <p>{name}</p>
        <select value={language} onChange={onChangeHandler} >
            {
                supportedLanguages.map((elem,index)=>{
                    return <option value={elem.code} key = {index}>{elem.name}</option>
                })
            }
        </select>
    </div>
  )
}

export default Select