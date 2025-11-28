import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export function FAQAccordion() {
    return (
        <div className="text-white w-full max-w-4xl mx-auto pt-20 pb-32 px-4">
            <div className="mb-12 text-center">
                <h2 className="text-5xl font-extrabold mb-4 text-white">
                    Frequently Asked Questions
                </h2>
                <p className="text-gray-400 text-lg">Everything you need to know about Mockable</p>
            </div>

            <Accordion
                type="single"
                collapsible
                className="w-full flex flex-col gap-4"
                defaultValue="item-1"
            >
                {/* 2. How does Mockable work? */}
                <AccordionItem value="item-2" className="border border-white/10 bg-white/5 rounded-xl px-4 backdrop-blur-sm transition-all duration-300">
                    <AccordionTrigger className="hover:no-underline py-6">
                        <p className="text-white text-xl font-semibold text-left">How does Mockable work?</p>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 pb-6">
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Users select a job role and experience level, then engage in a simulated interview. Our AI asks questions, analyzes responses for content, tone, and clarity, and provides instant, personalized feedback.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                {/* 3. What kind of feedback does Mockable provide? */}
                <AccordionItem value="item-3" className="border border-white/10 bg-white/5 rounded-xl px-4 backdrop-blur-sm transition-all duration-300">
                    <AccordionTrigger className="hover:no-underline py-6">
                        <p className="text-white text-xl font-semibold text-left">What kind of feedback does Mockable provide?</p>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 pb-6">
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Mockable offers comprehensive feedback including analysis of your answers' relevance and depth, speech patterns (e.g., filler words, pace), emotional cues, and suggestions for improvement.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                {/* 4. Is Mockable suitable for all job levels? */}
                <AccordionItem value="item-4" className="border border-white/10 bg-white/5 rounded-xl px-4 backdrop-blur-sm transition-all duration-300">
                    <AccordionTrigger className="hover:no-underline py-6">
                        <p className="text-white text-xl font-semibold text-left">Is Mockable suitable for all job levels?</p>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 pb-6">
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Yes, Mockable is designed for a wide range of users, from students and new graduates to experienced professionals looking to refine their interview skills. You can select your experience level to tailor the interview difficulty.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                {/* 5. What makes Mockable different from other interview platforms? */}
                <AccordionItem value="item-5" className="border border-white/10 bg-white/5 rounded-xl px-4 backdrop-blur-sm transition-all duration-300">
                    <AccordionTrigger className="hover:no-underline py-6">
                        <p className="text-white text-xl font-semibold text-left">What makes Mockable different from other interview platforms?</p>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 pb-6">
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Our platform stands out with its adaptive AI questions, real-time emotion analysis, and highly personalized, actionable feedback that goes beyond generic tips to target your specific areas for improvement.
                        </p>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    )
}
