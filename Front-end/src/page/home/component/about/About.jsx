import { Goal } from "lucide-react";
import AboutSection from "./AboutSection";
import Problem from "./ProblemAbout/Problem";
import Solution from "./SolutionAbout/Solution";
import GoalAbout from "./GoalSection/GoalAbout";
const About = () => {
    return (
        <div className="px-4 py-4">
            <AboutSection />
            <Problem />
            <Solution/>
            <GoalAbout/>
        </div>
    );
}

export default About;
