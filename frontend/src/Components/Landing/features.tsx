import Card from './Card'

const Features = () => {
    const mockableFeatures = [
        {
            title: "AI-Powered Mock Interviews",
            description: "Simulated interviews tailored to your role, skill level, and experience using advanced AI models.",
        },
        {
            title: "Performance Dashboard",
            description: "Analyze your progress with rich insights, graphs, strengths, weaknesses, and improvement areas.",
        },
        {
            title: "Resume Parsing",
            description: "Get intelligent suggestions to optimize your resume for ATS systems and recruiter screening.",
        },
        {
            title: "Resume–JD Match Score",
            description: "Compare your resume with a job description and receive match scoring and improvement tips.",
        },
        {
            title: "Multiple Interview Modes",
            description: "Practice HR, Technical, Behavioral, System Design, DSA, or role-specific interview flows.",
        },
        {
            title: "PDF Report Generation",
            description: "Download a detailed interview report with insights, scores, transcripts, and improvement paths.",
        },
        
    ];

    return (
        <div>
            <div className='flex flex-col justify-center mt-20 text-white text-center gap-20'>
                <div className='flex flex-col gap-3'>
                    <h1 className='text-6xl font-extrabold'>Boost your interview chances</h1>
                    <p className='text-gray-300'><span className='font-bold text-gray-200'>Mockable</span> gives you a detailed report on what's holding them back - and how to improve before applying</p>
                </div>

                <div className='flex flex-row gap-5 flex-wrap justify-center'>
                    {mockableFeatures.map((item, index) => (
                        <Card key={index} title={item.title} description={item.description} />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Features