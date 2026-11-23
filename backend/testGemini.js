import { analyzeCandidate } from "./services/aiMatchingService.js";

const jobDescription = `
We are looking for a Full Stack Developer.

Requirements:
- React.js
- JavaScript
- Node.js
- Express.js
- MySQL
- REST APIs
- Git
- Basic Docker knowledge
`;

const resume = `
Frontend and backend developer with experience in React.js,
JavaScript, Node.js, Express.js and MySQL.

Built REST APIs and worked with Git.
Have experience developing full stack web applications.
`;

try {
  const result = await analyzeCandidate(jobDescription, resume);

  console.log("\n===== AI MATCH RESULT =====\n");
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error);
}