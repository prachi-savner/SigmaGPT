import express from "express";
import Thread from "../models/threads.js";

import getOpenAIAPIResponse from "../utils/openAi.js";
const router = express.Router();

router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "xyz123",
      title: "sample test thread",
    });
    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create thread" });
  }
});

router.get("/threads", async (req, res) => {
  try {
    const threads = await Thread.find();
    if (!threads) {
      return res.status(404).json({ error: "No threads found" });
    }
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

router.get("/threads/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

router.delete("/threads/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    return res.status(400).json({ error: "threadId and message are required" });
  }

  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
       thread = new Thread({
        threadId,
        title: message,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });
      await thread.save();
    } else {
      thread.messages.push({
        role: "user",
        content: message,
      });
    }
    const assistantReply = await getOpenAIAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = Date.now();
    await thread.save();
    res.json(assistantReply);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});
export default router;
