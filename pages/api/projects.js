// ./pages/api/projects.js
const { prisma } = require('../../lib/prisma');
const auth = require('../../lib/auth');

console.log('Auth module:', auth); // Debug import
const { verifyToken } = auth;


export default async function handler(req, res) {
   // const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const token = req.cookies.authToken;
  //console.log('Token:', token); // Debug token
  let decoded = null;
  if (token) {
    try {
      decoded = await verifyToken(token);
   //   console.log('Decoded token:', decoded);
    } catch (error) {
      console.error('Token Verification Error:', error);
    }
  }

  // Require login for all methods
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch all projects for logged-in users
      const projects = await prisma.projects.findMany();
      const formattedProjects = projects.map(project => ({
        ...project,
        id: project.id.toString(),
        ownership: project.ownership.toString(),
        Team: project.Team ? project.Team.map(id => id.toString()) : [],
      }));
      res.status(200).json(formattedProjects);
    } catch (error) {
      console.error('GET Error:', error);
      res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const body = req.body;
      if (!body.title || !body.projectdomain || !body.updatedBy || !body.lastUpdatedAt) {
        return res.status(400).json({ error: 'Missing required fields' });
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
          ownership: decoded.id, // Set ownership to the authenticated user
          Team: body.Team ? body.Team.map(String) : [],
        },
      });
      res.status(201).json({
        ...newProject,
        id: newProject.id.toString(),
        ownership: newProject.ownership.toString(),
        Team: newProject.Team ? newProject.Team.map(id => id.toString()) : [],
      });
    } catch (error) {
      console.error('POST Error:', error);
      res.status(400).json({ error: 'Failed to create project', details: error.message });
    }
  } else if (req.method === 'PUT') {
  const { id, ...updatedProject } = req.body;
  try {
    const project = await prisma.projects.findUnique({ where: { id: String(id) } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    if (String(project.ownership) !== String(decoded.id)) {
      return res.status(403).json({
        error: 'Forbidden: Only the owner can edit this project',
        details: { projectOwnership: project.ownership, userId: decoded.id },
      });
    }
    const updated = await prisma.projects.update({
      where: { id: String(id) },
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
        Team: updatedProject.Team ? updatedProject.Team.map(String) : undefined,
      },
    });
    res.status(200).json({
      ...updated,
      id: updated.id.toString(),
      ownership: updated.ownership.toString(),
      Team: updated.Team ? updated.Team.map(id => id.toString()) : [],
    });
  } catch (error) {
    console.error('PUT Error:', error);
    res.status(500).json({ error: 'Failed to update project', details: error.message });
  }
} else if (req.method === 'DELETE') {
    const { id } = req.body;
    try {
      const project = await prisma.projects.findUnique({ where: { id: String(id) } });
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
       console.log("🔎 Debug Delete:");
    console.log("DB Ownership:", project.ownership, typeof project.ownership);
    console.log("Decoded User:", decoded.id, typeof decoded.id);

      // if (project.ownership !== decoded.id) {
      //   return res.status(403).json({ error: 'Forbidden: Only the owner can delete this project' });
      // }
      if (project.ownership.toString() !== decoded.id.toString()) {
  return res.status(403).json({
    error: 'Forbidden: Only the owner can delete this project',
    details: { projectOwnership: project.ownership.toString(), userId: decoded.id.toString() }
  });
}
      await prisma.projects.delete({
        where: { id: String(id) },
      });
      res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
      console.error('DELETE Error:', error);
      res.status(500).json({ error: 'Failed to delete project', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}