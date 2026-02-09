import mongoos from 'mongoose'

const checkConnection =async() =>{
    const uri =process.env.DB_URI

    try{
        const result =await mongoos.connect(uri)
        // console.log(result)
        console.log("DB connected sucessfully 👌");
        
        
    }catch(error){
        console.log("faild to connect DB ❌");
        
    }
    
    
}

export default checkConnection