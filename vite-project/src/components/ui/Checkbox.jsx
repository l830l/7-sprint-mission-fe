const CheckBox = ({id, text, checked, onChange}) => {
    return (
        <>
            <input
                id = {id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="custom-checkbox-input"
            />
            <label className="custom-checkbox" htmlFor={id}>
                
                {text}
            </label>
        </>
    )
}

export default CheckBox;