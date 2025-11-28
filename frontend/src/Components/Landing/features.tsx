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
        <div className='w-full px-4 mb-32'>
            <div className='flex flex-col items-center justify-center mt-20 text-white text-center gap-16 max-w-7xl mx-auto'>
                <div className='flex flex-col gap-6 max-w-3xl'>
                    <h2 className='text-5xl md:text-6xl font-extrabold tracking-tight'>
                        Boost your interview chances
                    </h2>
                    <p className='text-gray-400 text-xl leading-relaxed'>
                        <span className='font-bold text-white'>Mockable</span> gives you a detailed report on what's holding you back - and how to improve before applying.
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
                    {mockableFeatures.map((item, index) => (
                        <Card key={index} title={item.title} description={item.description} />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Features