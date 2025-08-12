class APIerror extends Error {
    constructor (
        statusCode ,
        message  = "Something went wrong",
        errors = [],
        stack = " "
    ){
        super(message)  // kya toh override krna hai ya or bhi aad k rna hai message toh bhejega h 
        this.statusCode = statusCode
        this.data = null ;   // oject 
        this.message = message
        this.success = false 
        this.errors = errors
    }   
}
export default APIerror ;