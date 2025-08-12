// const asynHandler = (func) =>{
//     (req, res , next ) =>{
//         Promise.resolve(func(req,res,next)).catch((error)=>next(error))
//     }
// }
// export default asynHandler



const wrapper = (func) =>  async(req , res , next )  => {
    try {
     await func(req , res , next)
    } catch (error) {
        res.status(error.code || 500).json({
         success : false,
         message :error.message
                });
    }
}
// standarzied api error or api response // 

export default wrapper ;