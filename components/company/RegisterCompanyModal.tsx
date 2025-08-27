import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import RegisterCompanyForm from "./RegisterCompanyForm"

export default function RegisterCompany({
    openModal,
    setOpenModal
}:{
    openModal:boolean,
    setOpenModal:(open:boolean) => void
}){

  return(
    <Dialog open={openModal} onOpenChange={setOpenModal}>
  <DialogContent className="bg-navy border border-purpleDark p-6 sm:max-w-xl w-full rounded-xl shadow-lg">
    <DialogHeader className="mb-4">
      <DialogTitle className="text-white text-2xl font-semibold">
        Register Company
      </DialogTitle>
    </DialogHeader>
    <div className="w-full space-y-6">
        <RegisterCompanyForm 
        
        />
    </div>
  </DialogContent>
</Dialog>

  )
}


