
export const asyncHandler = (fn)=>{
 return async(req,res,next)=>{
  try{
   await fn(req,res,next)
  }catch(error){
   error.cause=500
   next(error)
  }
 }
}

export const successResponse=({res,message="DONE",status=200,data={}}={})=>{
 res.status(status).json({message,data})
}

export const globalErrorHandler=(error,req,res,next)=>{
 return res.status(error.cause||400).json({
  message:error.message,
  stack:process.env.MOOD==="DEV"?error.stack:undefined
 })
}
