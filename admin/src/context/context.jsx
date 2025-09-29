import { createContext, useEffect } from "react";


export const context = createContext();

const ContextProvider = (props) => {
    

    const value = {
        
    }


    return (
        <div>
            <context.Provider value={value}>
            {props.children}
            </context.Provider>
        </div>
       
    )

}


export default ContextProvider;
