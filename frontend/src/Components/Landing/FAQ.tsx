import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export function FAQAccordion() {
    return (
        <div className="text-white w-[90vw] pt-20">
            <div>
                <h1 className="text-5xl font-extrabold mb-4 text-center">Frequently Asked Questions</h1>
            </div>
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
            >
                {/* 1. What is Mockable? */}
                <AccordionItem value="item-1">
                    <AccordionTrigger><p className="text-white text-lg">What is Mockable?</p></AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 ">
                        <p className="text-gray-300 ">
                            Mockable is an AI-powered mock interview platform that helps students and job seekers practice real interview scenarios using adaptive questions, emotion analysis, speech-to-text responses, and AI-driven feedback.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                {/* 6. What does the report include? */}
                <AccordionItem value="item-6">
                    <AccordionTrigger><p className="text-white text-lg">What does the interview report include?</p></AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 ">
                        <p className="text-gray-300 ">The AI-generated report includes:</p>
                        <ul className="list-disc ml-6">
                            <li>Emotion timeline</li>
                            <li>Answer quality score</li>
                            <li>Plagiarism score</li>
                            <li>Speech clarity</li>
                            <li>Confidence analysis</li>
                            <li>Strengths & weaknesses</li>
                            <li>PDF export</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                {/* 8. Who should use Mockable? */}
                <AccordionItem value="item-8">
                    <AccordionTrigger><p className="text-white text-lg">Who should use Mockable?</p></AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 ">
                        <p className="text-gray-300 ">
                            Students, freshers, job seekers, working professionals, and anyone who wants
                            to improve interview performance, confidence, and communication skills.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                {/* 10. Is Mockable free to use? */}
                <AccordionItem value="item-10">
                    <AccordionTrigger><p className="text-white text-lg">Is Mockable free to use?</p></AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 ">
                        <p className="text-gray-300 ">
                            Mockable offers both free and premium plans. The free tier includes basic
                            mock interviews, limited reports, and light resume analysis. Premium plans
                            unlock advanced AI features, detailed analytics, downloadable reports, and
                            unlimited interviews.
                        </p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
