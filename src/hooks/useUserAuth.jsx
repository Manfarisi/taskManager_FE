import { useContext } from "react"
import { UserContext } from "../context/userContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export const useUserauth = ()=>{
    const {user,loading,clearUser} = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(()=>{
        if(loading) return
        if(user) return

        if(!user){
            clearUser()
            navigate('/login')
        }
    },[user,loading,clearUser,navigate])
}