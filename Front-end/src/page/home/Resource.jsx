const Resource = () => {
    return (
        <div className="flex flex-col justify-start items-start gap-2 ">
            <div className="flex justify-center items-center gap-2">
                <span className="font-sans text-lg font-semibold">Resources</span>
            </div>
            <div className="flex flex-col justify-start items-start gap-2  mt-4">
                <span>Documentation</span>
                <span>API Reference</span>
                <span>Case Studies</span>
                <span>White Papers</span>
                <span>Blog</span>
                <span>Support Center</span>
            </div>
        </div>
    );
}

export default Resource;
