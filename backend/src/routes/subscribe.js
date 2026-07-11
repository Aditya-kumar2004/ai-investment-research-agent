import express from "express";
import Subscriber from "../models/Subscriber.js";
import { sendWelcomeEmail } from "../services/emailService.js";
import { z } from "zod";

const router = express.Router();

const subscribeSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
});

router.post("/subscribe", async (req, res, next) => {
  try {
    const parseResult = subscribeSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.issues[0]?.message || "Invalid input data",
      });
    }

    const { email } = parseResult.data;

    // Check if the user is already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: "You are already subscribed to the newsletter!",
      });
    }

    // Save subscriber to DB
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Trigger welcome email asynchronously (non-blocking so response is instant)
    sendWelcomeEmail(email).catch((emailErr) => {
      console.error("[Email Error] Failed to send welcome email:", emailErr);
    });

    return res.status(200).json({
      success: true,
      message: "Subscription successful! Welcome on board.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
