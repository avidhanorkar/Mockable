import C1 from '../Components/Landing/c1'
import C2 from '../Components/Landing/c2'
import { FAQAccordion } from '../Components/Landing/FAQ'
import Features from '../Components/Landing/features'
const Landing = () => {
  return (
    <div className=' flex flex-col gap-10 items-center justify-center '>
      <C1 />


      <C2 />
      <Features />

      <FAQAccordion />
    </div>
  )
}

export default Landing