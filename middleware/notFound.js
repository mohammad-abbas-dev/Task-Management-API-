let notFound = (req,res,next)=>{
 let error = new Error("page not found")
 error.status=404
 next(error)
}
export default notFound