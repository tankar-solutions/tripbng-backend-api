function isNull(array)
{
    if(array.some(
        (feild)=>feild== ""
    ))
    {
        return true;
    }
    return false;
}

export {isNull}