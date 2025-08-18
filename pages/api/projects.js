const prisma = require('../../lib/prisma');
const { verifyToken } = require('../../lib/auth');

export default async function handler(req, res) {
  console.log('Received headers:', req.headers.authorization);
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Extracted token:', token);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === "GET") {
    try {
      const projects = await prisma.projects.findMany({
        where: { ownership: BigInt(decoded.id) }, // Restrict to user's projects
      });
      const formattedProjects = projects.map(project => ({
        ...project,
        id: project.id.toString(),
        ownership: project.ownership.toString(),
        Team: project.Team.map(id => id.toString()),
      }));
      res.status(200).json(formattedProjects);
    } catch (error) {
      console.error("GET Error:", error);
      res.status(500).json({ error: "Failed to fetch projects", details: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const body = req.body;
      if (!body.title || !body.projectdomain || !body.updatedBy || !body.lastUpdatedAt || body.ownership === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      if (isNaN(body.ownership) || (body.Team && body.Team.some(t => isNaN(t)))) {
        return res.status(400).json({ error: "Invalid numeric values" });
      }
      const newProject = await prisma.projects.create({
        data: {
          title: body.title,
          projectdomain: body.projectdomain,
          description: body.description,
          liveUrl: body.liveUrl,
          GitHubUrl: body.GitHubUrl,
          UserAccess: body.UserAccess || [],
          activeStatus: body.activeStatus !== undefined ? body.activeStatus : true,
          updatedBy: body.updatedBy,
          lastUpdatedAt: new Date(body.lastUpdatedAt),
          ownership: BigInt(decoded.id), // Set ownership to the authenticated user
          Team: body.Team ? body.Team.map(BigInt) : [],
        },
      });
      res.status(201).json({
        ...newProject,
        id: newProject.id.toString(),
        ownership: newProject.ownership.toString(),
        Team: newProject.Team.map(id => id.toString()),
      });
    } catch (error) {
      console.error("POST Error:", error);
      res.status(400).json({ error: "Failed to create project", details: error.message });
    }
  } else if (req.method === "PUT") {
    const { id, ...updatedProject } = req.body;
    try {
      const project = await prisma.projects.update({
        where: { id: BigInt(id), ownership: BigInt(decoded.id) }, // Restrict to user's projects
        data: {
          title: updatedProject.title,
          projectdomain: updatedProject.projectdomain,
          description: updatedProject.description,
          liveUrl: updatedProject.liveUrl,
          GitHubUrl: updatedProject.GitHubUrl,
          UserAccess: updatedProject.UserAccess,
          activeStatus: updatedProject.activeStatus,
          updatedBy: updatedProject.updatedBy,
          lastUpdatedAt: updatedProject.lastUpdatedAt ? new Date(updatedProject.lastUpdatedAt) : undefined,
          Team: updatedProject.Team ? updatedProject.Team.map(BigInt) : undefined,
        },
      });
      res.status(200).json({
        ...project,
        id: project.id.toString(),
        ownership: project.ownership.toString(),
        Team: project.Team.map(id => id.toString()),
      });
    } catch (error) {
      console.error("PUT Error:", error);
      res.status(404).json({ error: "Project not found or update failed", details: error.message });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    try {
      await prisma.projects.delete({
        where: { id: BigInt(id), ownership: BigInt(decoded.id) }, // Restrict to user's projects
      });
      res.status(200).json({ message: "Project deleted" });
    } catch (error) {
      console.error("DELETE Error:", error);
      res.status(404).json({ error: "Project not found or delete failed", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
// const prisma = require('../../lib/prisma');

// export default async function handler(req, res) {
//   if (req.method === "GET") {
//     try {
//       const projects = await prisma.projects.findMany();
//       const formattedProjects = projects.map(project => ({
//         ...project,
//         id: project.id.toString(),
//         ownership: project.ownership.toString(),
//         Team: project.Team.map(id => id.toString()),
//       }));
//       res.status(200).json(formattedProjects);
//     } catch (error) {
//       console.error("GET Error:", error);
//       res.status(500).json({ error: "Failed to fetch projects from above", details: error.message });
//     }
//   } 
//   else if (req.method === "POST") {
//     try {
//       const body = req.body;
//       if (!body.title || !body.projectdomain || !body.updatedBy || !body.lastUpdatedAt || body.ownership === undefined) {
//         return res.status(400).json({ error: "Missing required fields: title, projectdomain, updatedBy, lastUpdatedAt, or ownership" });
//       }
//       if (isNaN(body.ownership) || (body.Team && body.Team.some(t => isNaN(t)))) {
//         return res.status(400).json({ error: "Invalid numeric values for ownership or Team" });
//       }
//       const newProject = await prisma.projects.create({
//         data: {
//           title: body.title,
//           projectdomain: body.projectdomain,
//           description: body.description,
//           liveUrl: body.liveUrl,
//           GitHubUrl: body.GitHubUrl,
//           UserAccess: body.UserAccess || [],
//           activeStatus: body.activeStatus !== undefined ? body.activeStatus : true,
//           updatedBy: body.updatedBy,
//           lastUpdatedAt: new Date(body.lastUpdatedAt),
//           ownership: BigInt(body.ownership),
//           Team: body.Team ? body.Team.map(BigInt) : [],
//         },
//       });
//       res.status(201).json({
//         ...newProject,
//         id: newProject.id.toString(),
//         ownership: newProject.ownership.toString(),
//         Team: newProject.Team.map(id => id.toString()),
//       });
//     } catch (error) {
//       console.error("POST Error:", error);
//       if (error.code === 'P2002') {
//         res.status(400).json({ error: "Failed to create project", details: "Duplicate id detected. This should not occur with auto-increment." });
//       } else {
//         res.status(400).json({ error: "Failed to create project", details: error.message });
//       }
//     }
//   } 
//   else if (req.method === "PUT") {
//     const { id, ...updatedProject } = req.body;
//     try {
//       const project = await prisma.projects.update({
//         where: { id: BigInt(id) },
//         data: {
//           title: updatedProject.title,
//           projectdomain: updatedProject.projectdomain,
//           description: updatedProject.description,
//           liveUrl: updatedProject.liveUrl,
//           GitHubUrl: updatedProject.GitHubUrl,
//           UserAccess: updatedProject.UserAccess,
//           activeStatus: updatedProject.activeStatus,
//           updatedBy: updatedProject.updatedBy,
//           lastUpdatedAt: updatedProject.lastUpdatedAt ? new Date(updatedProject.lastUpdatedAt) : undefined,
//           ownership: updatedProject.ownership ? BigInt(updatedProject.ownership) : undefined,
//           Team: updatedProject.Team ? updatedProject.Team.map(BigInt) : undefined,
//         },
//       });
//       res.status(200).json({
//         ...project,
//         id: project.id.toString(),
//         ownership: project.ownership.toString(),
//         Team: project.Team.map(id => id.toString()),
//       });
//     } catch (error) {
//       console.error("PUT Error:", error);
//       res.status(404).json({ error: "Project not found or update failed", details: error.message });
//     }
//   } 
//   else if (req.method === "DELETE") {
//     const { id } = req.body;
//     try {
//       await prisma.projects.delete({
//         where: { id: BigInt(id) },
//       });
//       res.status(200).json({ message: "Project deleted" });
//     } catch (error) {
//       console.error("DELETE Error:", error);
//       res.status(404).json({ error: "Project not found or delete failed", details: error.message });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }

