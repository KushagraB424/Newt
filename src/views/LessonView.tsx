import React, { useState } from "react";
import { LessonPath } from "../components/Navigation/LessonPath";
import { TutorBubble } from "../components/Chat/TutorBubble";
import type { Message } from "../components/Chat/TutorBubble";
import { Stage } from "../components/Stage/Stage";
import { CoordinatePlane } from "../components/Primitives/CoordinatePlane";
import { NumberLine } from "../components/Primitives/NumberLine";
import { BalanceScale } from "../components/Primitives/BalanceScale";
import { FractionBars } from "../components/Primitives/FractionBars";
import { ParticleBox } from "../components/Primitives/ParticleBox";
import { Whiteboard } from "../components/Whiteboard/Whiteboard";
import { AnswerBox } from "../components/Input/AnswerBox";
import { FeedbackBanner } from "../components/Feedback/FeedbackBanner";
import { HintLadder } from "../components/Hint/HintLadder";
import { TalkButton } from "../components/Voice/TalkButton";
import { Mascot } from "../components/Mascot/Mascot";
import { playGotItSound, playNotYetSound } from "../utils/audio";
import "./LessonView.css";

export interface LessonViewProps {
  topicId?: string;
  isMuted?: boolean;
  onToggleMute?: () => void;
  theme?: "explorer" | "middle" | "middle-dark";
  onMasteryReached?: () => void;
  kidName?: string;
  selectedWorlds?: string[];
}

function getDialoguesForWorlds(kidName: string, worlds: string[], topicId: string = "linear-eq"): Record<number, Message[]> {
  const primaryWorld = worlds[0] || "minecraft";

  if (topicId === "balance") {
    return {
      0: [
        { id: "bal0-1", sender: "tutor", text: `Imagine a playground seesaw, ${kidName}. How do you keep it perfectly level in the air?` },
        { id: "bal0-2", sender: "kid", text: "Both sides have to balance with the exact same weight!" },
        { id: "bal0-3", sender: "tutor", text: "Spot on! An equation is simply a balanced scale: whatever is on the left must equal what is on the right." },
      ],
      1: [
        { id: "bal1-1", sender: "tutor", text: "Why must you do the same operation to both sides of an equation?" },
        { id: "bal1-2", sender: "kid", text: "Because if you only add to one side, the seesaw tips over!" },
        { id: "bal1-3", sender: "tutor", text: "Exactly! Equal changes to both sides preserve the balance." },
      ],
      2: [
        { id: "bal2-1", sender: "tutor", text: "Try adjusting the value of mystery x on the scale below to balance 2x + 3 = 7." },
        { id: "bal2-2", sender: "kid", text: "When x is 2, the left pan has 2(2) + 3 = 7, perfectly matching the right pan!" },
        { id: "bal2-3", sender: "tutor", text: "That is true algebraic balance." },
      ],
      3: [
        { id: "bal3-1", sender: "tutor", text: "Watch how subtracting 3 from both sides leaves 2x = 4, so x = 2." },
      ],
      4: [
        { id: "bal4-1", sender: "tutor", text: `Check understanding, ${kidName}: If 2x = 6, what must x equal to balance the scale? (Hint: 3)` },
      ],
      5: [
        { id: "bal5-1", sender: "tutor", text: "Balance challenge! Adjust x so 2x + 3 = 7 balances perfectly level." },
      ],
    };
  }

  if (topicId === "fractions") {
    return {
      0: [
        { id: "frac0-1", sender: "tutor", text: `If you slice a pizza into 8 slices instead of 4, are the slices bigger or smaller, ${kidName}?` },
        { id: "frac0-2", sender: "kid", text: "Smaller, because the whole is cut into more pieces!" },
        { id: "frac0-3", sender: "tutor", text: "Spot on! The denominator tells you how many slices make up the whole." },
      ],
      1: [
        { id: "frac1-1", sender: "tutor", text: "Why is 1/4 bigger than 1/8?" },
        { id: "frac1-2", sender: "kid", text: "Because 4 big slices take up more room than 1 slice out of 8." },
        { id: "frac1-3", sender: "tutor", text: "Exactly! Fewer slices means each individual slice is larger." },
      ],
      2: [
        { id: "frac2-1", sender: "tutor", text: "Tap the fraction bars below to shade slices and compare different denominators." },
      ],
      3: [
        { id: "frac3-1", sender: "tutor", text: "Watch how 2 fourths covers the exact same bar length as 4 eighths." },
      ],
      4: [
        { id: "frac4-1", sender: "tutor", text: `Check understanding: how many eighths make up 1/2 of the whole? (Hint: 4)` },
      ],
      5: [
        { id: "frac5-1", sender: "tutor", text: "Fraction challenge! Tap to shade 1 slice on each fraction bar." },
      ],
    };
  }

  if (topicId === "particles") {
    return {
      0: [
        { id: "part0-1", sender: "tutor", text: `What makes ice different from liquid water, ${kidName}?` },
        { id: "part0-2", sender: "kid", text: "Ice holds its shape, but water flows and pours!" },
        { id: "part0-3", sender: "tutor", text: "Exactly. Underneath, it is all about heat energy and how fast particles vibrate." },
      ],
      1: [
        { id: "part1-1", sender: "tutor", text: "Why do particles fly apart when heated to a gas?" },
        { id: "part1-2", sender: "kid", text: "Thermal heat gives them energy to break free and bounce!" },
        { id: "part1-3", sender: "tutor", text: "Yes! High thermal energy overcomes the attractions between them." },
      ],
      2: [
        { id: "part2-1", sender: "tutor", text: "Switch the temperature between Cold, Warm, and Hot to watch the particles transition states." },
      ],
      3: [
        { id: "part3-1", sender: "tutor", text: "Notice how solid particles vibrate in place, while gas particles fill the container." },
      ],
      4: [
        { id: "part4-1", sender: "tutor", text: `Check understanding: which state of matter has particles moving fastest? (Solid, Liquid, or Gas)` },
      ],
      5: [
        { id: "part5-1", sender: "tutor", text: "Heat challenge! Heat the particle box to Hot (Gas) and observe the collisions." },
      ],
    };
  }

  if (topicId === "numberline") {
    return {
      0: [
        { id: "num0-1", sender: "tutor", text: `Imagine walking along a number path, ${kidName}. What is the difference between jumping forward versus backward?` },
        { id: "num0-2", sender: "kid", text: "Forward increases your number, backward moves into negative numbers." },
        { id: "num0-3", sender: "tutor", text: "Spot on! The number line gives direction to positive and negative numbers." },
      ],
      1: [
        { id: "num1-1", sender: "tutor", text: "Why is -3 less than -1?" },
        { id: "num1-2", sender: "kid", text: "Because -3 is further left away from zero." },
        { id: "num1-3", sender: "tutor", text: "Exactly! Numbers further to the left are always smaller." },
      ],
      2: [
        { id: "num2-1", sender: "tutor", text: "Drag the dot or use arrow keys to make jumps on the number line." },
      ],
      3: [
        { id: "num3-1", sender: "tutor", text: "Watch how jumping 3 units left from 1 lands right at -2." },
      ],
      4: [
        { id: "num4-1", sender: "tutor", text: `Check understanding: if you start at 2 and jump -5, where do you land? (Hint: -3)` },
      ],
      5: [
        { id: "num5-1", sender: "tutor", text: "Practice challenge! Jump the number line dot to 3." },
      ],
    };
  }

  if (topicId === "systems") {
    return {
      0: [
        { id: "sys0-1", sender: "tutor", text: `Welcome to Systems of Equations, ${kidName}! What happens when two different paths cross each other?` },
        { id: "sys0-2", sender: "kid", text: "They share one point where both paths touch." },
        { id: "sys0-3", sender: "tutor", text: "Spot on! That crossing point is the single coordinate where both equations are true at the exact same moment." },
      ],
      1: [
        { id: "sys1-1", sender: "tutor", text: "Why is an intersection point special compared to any other coordinate?" },
        { id: "sys1-2", sender: "kid", text: "Because only that point works for both lines at the same time." },
        { id: "sys1-3", sender: "tutor", text: "Exactly! It solves both equations simultaneously." },
      ],
      2: [
        { id: "sys2-1", sender: "tutor", text: `Look at the grid, ${kidName}: we have a target line y = -x + 4. Try adjusting your line (slope 2, start 1) to see where they cross.` },
        { id: "sys2-2", sender: "kid", text: "They meet right at x = 1, y = 3!" },
        { id: "sys2-3", sender: "tutor", text: "Yes! (1, 3) is the simultaneous solution to the system." },
      ],
      3: [
        { id: "sys3-1", sender: "tutor", text: "Watch how the two lines intersect. At x = 1, both equations produce y = 3!" },
      ],
      4: [
        { id: "sys4-1", sender: "tutor", text: `Check understanding, ${kidName}: If Line 1 is y = 2x + 1 and Line 2 is y = -x + 4, what coordinate solves both? (Hint: 1, 3)` },
      ],
      5: [
        { id: "sys5-1", sender: "tutor", text: "Systems challenge! Adjust your sliders so your line crosses y = -x + 4 at (1, 3)." },
      ],
    };
  }

  let step0Intro = `Before we write any formulas: what makes one hill steeper than another, ${kidName}?`;
  let step0Kid = "It feels like climbing up a steep ramp versus walking on flat ground.";
  let step0Tutor = "Exactly. Steepness is simply comparing how high you climb for every single step forward.";

  let step1Intro = "Why does a negative slope go down? Can you picture it?";
  let step1Kid = "Because walking forward is like walking downhill.";
  let step1Tutor = "Yes! Every step right costs you height. The line goes down because every step right loses 2 units.";

  if (primaryWorld === "minecraft") {
    step0Intro = `Hey ${kidName}, imagine building a staircase up a mountain in Minecraft. What makes one staircase steeper than another?`;
    step0Kid = "It takes more blocks high to climb up each forward block step!";
    step0Tutor = "Spot on. In Minecraft or in math: steepness compares how high you climb for every block you move forward.";
    step1Intro = "In Minecraft, why does a negative slope go down? Imagine mining a downward tunnel.";
    step1Kid = "Every block forward drops deeper down into the cavern.";
    step1Tutor = "Exactly! Moving forward (+1 right) drops your elevation (-2 height). That is why the rate is negative.";
  } else if (primaryWorld === "soccer") {
    step0Intro = `Hey ${kidName}, imagine kicking a soccer ball toward the net. What makes a lofted chip climb steeper than a drive?`;
    step0Kid = "It climbs way higher in the air over a shorter distance on the pitch!";
    step0Tutor = "Spot on! Steepness compares how high the ball climbs for every yard forward across the pitch.";
    step1Intro = "When the ball arcs past its peak and drops toward the goal, why is that slope negative?";
    step1Kid = "Because moving forward toward the net, the ball loses height.";
    step1Tutor = "Exactly! Forward is positive run, but losing height makes the rise negative.";
  } else if (primaryWorld === "space") {
    step0Intro = `Hey ${kidName}, imagine piloting a rocket launching toward orbit. What makes an ascent trajectory climb steeper?`;
    step0Kid = "It climbs way faster into the sky than it travels sideways!";
    step0Tutor = "Spot on! The climb rate compares altitude gained for every horizontal mile covered.";
  } else if (primaryWorld === "baking") {
    step0Intro = `Hey ${kidName}, imagine rolling pastry dough down an angled marble baking slab. What makes an incline steep?`;
    step0Kid = "The higher the top edge is propped up, the faster the roller drops down!";
    step0Tutor = "Spot on! The slope compares the height of the pastry slab to the length of the counter.";
  }

  return {
    0: [
      { id: "step0-1", sender: "tutor", text: step0Intro },
      { id: "step0-2", sender: "kid", text: step0Kid },
      { id: "step0-3", sender: "tutor", text: step0Tutor },
    ],
    1: [
      { id: "step1-1", sender: "tutor", text: step1Intro },
      { id: "step1-2", sender: "kid", text: step1Kid },
      { id: "step1-3", sender: "tutor", text: step1Tutor },
    ],
    2: [
      { id: "step2-1", sender: "tutor", text: `Here is the picture on the grid, ${kidName}. We call the vertical step the 'rise' and horizontal step the 'run'.` },
      { id: "step2-2", sender: "kid", text: "So rise over run shows the steepness?" },
      { id: "step2-3", sender: "tutor", text: "Try moving the slope slider below to watch the steepness change live." },
    ],
    3: [
      { id: "step3-1", sender: "tutor", text: "Watch the board draw the rise-over-run triangle in real time with me." },
      { id: "step3-2", sender: "kid", text: "I see the steps forming a staircase." },
      { id: "step3-3", sender: "tutor", text: "Every single step right costs you 2 up, so the staircase rate is always 2." },
    ],
    4: [
      { id: "step4-1", sender: "tutor", text: `Check your understanding, ${kidName}: if a line climbs 4 units up for every 2 steps forward, what is its slope?` },
    ],
    5: [
      { id: "step5-1", sender: "tutor", text: "Final practice challenge! Use the sliders to plot a line with a slope of 2 and start at 1." },
    ],
  };
}

export const LessonView: React.FC<LessonViewProps> = ({
  topicId = "linear-eq",
  isMuted = false,
  onToggleMute,
  theme = "explorer",
  onMasteryReached,
  kidName = "Maya",
  selectedWorlds = ["minecraft", "soccer"],
}) => {
  const dialogues = getDialoguesForWorlds(kidName, selectedWorlds, topicId);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>(dialogues[0]);
  const [isCanvasOpen, setIsCanvasOpen] = useState<boolean>(true);
  const [showHintLadder, setShowHintLadder] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "got-it" | "not-yet"; message: string } | null>(null);
  const [isTutorLoading, setIsTutorLoading] = useState<boolean>(false);

  // Big idea step local state (interactive steepness hill)
  const [hillSteepness, setHillSteepness] = useState<"flat" | "gentle" | "steep">("gentle");

  // Why step local state (uphill vs downhill)
  const [directionMode, setDirectionMode] = useState<"uphill" | "downhill">("downhill");

  const handleStepChange = (index: number) => {
    setCurrentStepIndex(index);
    setMessages(dialogues[index] || []);
    setFeedback(null);
    setShowHintLadder(false);
  };

  const handlePrimitiveCheck = (_m: number, _b: number, isCorrect: boolean) => {
    if (isCorrect) {
      playGotItSound(isMuted);
      const gotItMsg =
        topicId === "systems"
          ? "You aligned your line to intersect y = -x + 4 right at (1, 3)!"
          : "You aligned the line with both the slope of 2 and intercept of 1.";
      setFeedback({
        type: "got-it",
        message: gotItMsg,
      });

      const tutorText =
        topicId === "systems"
          ? "Got it! At x = 1, both lines equal 3. You solved the system of equations!"
          : "Got it! Every single step right costs you 2 up, so m = 2 and b = 1.";
      const newMsg: Message = {
        id: `tutor-${Date.now()}`,
        sender: "tutor",
        text: tutorText,
      };
      setMessages((prev) => [...prev, newMsg]);

      if (currentStepIndex >= 4) {
        setTimeout(() => onMasteryReached?.(), 1500);
      }
    } else {
      playNotYetSound(isMuted);
      setFeedback({
        type: "not-yet",
        message:
          topicId === "systems"
            ? "Look at where the lines cross. Adjust slope m to 2 and start b to 1 to meet at (1, 3)."
            : "Look at the sign and steepness. Does the line rise by 2 each step right?",
      });
    }
  };

  const handleKidAnswer = (answerText: string) => {
    const kidMsg: Message = {
      id: `kid-${Date.now()}`,
      sender: "kid",
      text: answerText,
    };
    setMessages((prev) => [...prev, kidMsg]);

    setIsTutorLoading(true);
    setTimeout(() => {
      setIsTutorLoading(false);
      let isPositiveAnswer = false;
      let gotItMessage = "";
      let tutorReply = "";
      let notYetMessage = "";

      if (topicId === "balance") {
        isPositiveAnswer = answerText.includes("3") || answerText.toLowerCase().includes("three");
        gotItMessage = "You solved 2x = 6. Dividing both sides by 2 gives x = 3!";
        tutorReply = "Got it! Since 2 times 3 is 6, each mystery x block weighs 3.";
        notYetMessage = "If 2x = 6, divide 6 by 2. What is 6 divided by 2?";
      } else if (topicId === "fractions") {
        isPositiveAnswer = answerText.includes("4") || answerText.toLowerCase().includes("four") || answerText.toLowerCase().includes("half");
        gotItMessage = "You found that 4 eighths equals 1/2 of the whole!";
        tutorReply = "Spot on! 4/8 simplifies to 1/2.";
        notYetMessage = "Think about 8 slices total. How many slices make half of 8?";
      } else if (topicId === "particles") {
        isPositiveAnswer = answerText.toLowerCase().includes("gas") || answerText.toLowerCase().includes("hot");
        gotItMessage = "You got it! Gas particles fly fastest with high thermal energy.";
        tutorReply = "Spot on! Gas particles move rapidly and bounce far apart.";
        notYetMessage = "Think about Ice, Water, and Steam. Which one has fast flying particles?";
      } else if (topicId === "numberline") {
        isPositiveAnswer = answerText.includes("-3") || answerText.toLowerCase().includes("negative 3");
        gotItMessage = "Starting at 2 and jumping -5 lands on -3!";
        tutorReply = "Got it! 2 minus 5 moves 5 units left to -3.";
        notYetMessage = "Start at 2 on the number line and count 5 steps left: where do you land?";
      } else if (topicId === "systems") {
        isPositiveAnswer = answerText.includes("1") || answerText.includes("3");
        gotItMessage = "You identified the intersection point (1, 3)!";
        tutorReply = "Got it! At x = 1, both equations produce y = 3.";
        notYetMessage = "Plug x = 1 into both lines: what is y for both lines?";
      } else {
        isPositiveAnswer =
          answerText.includes("2") ||
          answerText.toLowerCase().includes("two") ||
          answerText.toLowerCase().includes("up");
        gotItMessage = "You simplified 4 / 2 = 2. You used the rule both ways: up and to the right.";
        tutorReply = "You used the rule both ways: 4 up divided by 2 right is 2. The steepness is 2.";
        notYetMessage = "Divide vertical rise by horizontal run: what is 4 divided by 2?";
      }

      if (isPositiveAnswer) {
        playGotItSound(isMuted);
        setFeedback({
          type: "got-it",
          message: gotItMessage,
        });
        const reply: Message = {
          id: `tutor-${Date.now()}`,
          sender: "tutor",
          text: tutorReply,
        };
        setMessages((prev) => [...prev, reply]);
      } else {
        playNotYetSound(isMuted);
        setFeedback({
          type: "not-yet",
          message: notYetMessage,
        });
        const reply: Message = {
          id: `tutor-${Date.now()}`,
          sender: "tutor",
          text: `Not yet. ${notYetMessage}`,
        };
        setMessages((prev) => [...prev, reply]);
      }
    }, 1200);
  };

  const handleVoiceTranscript = (transcript: string) => {
    handleKidAnswer(transcript);
  };

  return (
    <div className={`lesson-view-wrapper ${isCanvasOpen ? "with-canvas" : "chat-only"}`}>
      {/* Top Bar: Lesson Path */}
      <div className="lesson-top-bar">
        <LessonPath
          currentStepIndex={currentStepIndex}
          onSelectStep={handleStepChange}
          onNextStep={() => handleStepChange(Math.min(5, currentStepIndex + 1))}
        />
        <button
          type="button"
          className="btn btn-outline canvas-toggle-btn"
          onClick={() => setIsCanvasOpen((prev) => !prev)}
        >
          {isCanvasOpen ? "Hide Stage" : "Open Stage"}
        </button>
      </div>

      {/* Main Layout Area */}
      <div className="lesson-main-layout">
        {/* Chat Column */}
        <section className={`lesson-chat-column ${isCanvasOpen ? "chat-col" : "chat-full"}`}>
          <div className="chat-thread-container">
            {/* Mascot in Explorer mode */}
            {theme === "explorer" && !isCanvasOpen && (
              <div className="chat-mascot-hero">
                <Mascot mood="idle" size={96} variant="clay" />
              </div>
            )}

            {/* Chat Messages */}
            <div className="chat-messages-scroll">
              {messages.map((m) => (
                <TutorBubble key={m.id} message={m} theme={theme} />
              ))}
              {isTutorLoading && <TutorBubble isLoading theme={theme} />}
            </div>

            {/* Active Feedback Banner */}
            {feedback && (
              <div className="chat-feedback-slot">
                <FeedbackBanner
                  type={feedback.type}
                  message={feedback.message}
                  onDismiss={() => setFeedback(null)}
                />
              </div>
            )}

            {/* Hint Ladder */}
            {showHintLadder && (
              <div className="chat-hint-slot">
                <HintLadder onClose={() => setShowHintLadder(false)} />
              </div>
            )}

            {/* Input slot: Only one active input on screen per spec */}
            {currentStepIndex === 5 ? (
              <div className="active-primitive-guide-card">
                <p>
                  👉 Use the <strong>m (slope)</strong> and <strong>b (start)</strong> sliders on the Stage to set your line, then tap <strong>Check line</strong>.
                </p>
              </div>
            ) : (
              <div className="chat-input-slot">
                <AnswerBox
                  placeholder={
                    currentStepIndex === 4
                      ? "Type the slope (e.g. 2)..."
                      : "Ask or answer Newt..."
                  }
                  onCheck={handleKidAnswer}
                  disabled={isTutorLoading}
                />
              </div>
            )}
          </div>

          {/* Talk Button fixed at foot */}
          <TalkButton
            onTranscript={handleVoiceTranscript}
            isMuted={isMuted}
            onToggleMute={onToggleMute}
          />
        </section>

        {/* Canvas Column (Stage Content based on Current Step) */}
        {isCanvasOpen && (
          <section className="lesson-canvas-column">
            <div className="canvas-header-strip">
              <span className="canvas-badge">
                Step {currentStepIndex + 1} of 6:{" "}
                {currentStepIndex === 0
                  ? "Big idea"
                  : currentStepIndex === 1
                  ? "Why"
                  : currentStepIndex === 2
                  ? "Picture"
                  : currentStepIndex === 3
                  ? "Video"
                  : currentStepIndex === 4
                  ? "Check"
                  : "Practice"}
              </span>
              <button
                type="button"
                className="btn btn-ghost canvas-back-btn"
                onClick={() => setIsCanvasOpen(false)}
              >
                Back to chat ←
              </button>
            </div>

            <div className="canvas-content-wrapper">
              {/* STEP 0: BIG IDEA (The Intuition before formulas) */}
              {/* STEP 0: BIG IDEA (The Intuition before formulas) */}
              {currentStepIndex === 0 && (
                topicId === "balance" ? (
                  <Stage
                    title="What is an equation? The Seesaw Balance"
                    readout="Left pan (6) = Right pan (6). Both sides must hold equal weight to stay level."
                    actionLabel="I see the balance →"
                    onActionClick={() => handleStepChange(1)}
                  >
                    <div className="steepness-demo-stage">
                      <svg viewBox="0 0 360 200" width="100%" height="200">
                        <polygon points="180,140 160,180 200,180" fill="var(--card)" stroke="var(--ink)" strokeWidth="3" />
                        <line x1="40" y1="140" x2="320" y2="140" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="180" cy="140" r="6" fill="var(--spark)" stroke="var(--ink)" strokeWidth="2" />
                        <rect x="50" y="95" width="65" height="42" rx="8" fill="var(--got-it-soft)" stroke="var(--got-it)" strokeWidth="3" />
                        <text x="82" y="122" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 16, fontWeight: 800 }}>6</text>
                        <text x="180" y="105" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 24, fontWeight: 900 }}>=</text>
                        <rect x="245" y="95" width="65" height="42" rx="8" fill="var(--got-it-soft)" stroke="var(--got-it)" strokeWidth="3" />
                        <text x="277" y="122" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 16, fontWeight: 800 }}>6</text>
                      </svg>
                    </div>
                  </Stage>
                ) : topicId === "fractions" ? (
                  <Stage
                    title="What is a fraction? Slicing the whole"
                    readout="Cutting into 4 slices leaves bigger pieces than cutting into 8 slices."
                    actionLabel="I see the slices →"
                    onActionClick={() => handleStepChange(1)}
                  >
                    <div className="steepness-demo-stage">
                      <svg viewBox="0 0 360 200" width="100%" height="200">
                        <rect x="40" y="45" width="280" height="45" rx="6" fill="var(--card)" stroke="var(--ink)" strokeWidth="2.5" />
                        <rect x="40" y="45" width="70" height="45" rx="6" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2.5" />
                        <text x="75" y="73" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 14, fontWeight: 800 }}>1/4 (Bigger)</text>
                        <rect x="40" y="115" width="280" height="45" rx="6" fill="var(--card)" stroke="var(--ink)" strokeWidth="2.5" />
                        <rect x="40" y="115" width="35" height="45" rx="6" fill="var(--not-yet)" stroke="var(--ink)" strokeWidth="2.5" />
                        <text x="57" y="143" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 12, fontWeight: 800 }}>1/8</text>
                      </svg>
                    </div>
                  </Stage>
                ) : topicId === "particles" ? (
                  <Stage
                    title="Solid, Liquid, and Gas: Particle Energy"
                    readout="In a solid, particles shake in place. Heated into gas, particles bounce fast."
                    actionLabel="Explore states →"
                    onActionClick={() => handleStepChange(1)}
                  >
                    <div className="steepness-demo-stage">
                      <svg viewBox="0 0 360 200" width="100%" height="200">
                        <rect x="45" y="40" width="115" height="120" rx="8" fill="var(--card)" stroke="var(--ink)" strokeWidth="2.5" />
                        <text x="102" y="30" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 13, fontWeight: 700 }}>Solid (Ice)</text>
                        {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
                          <circle key={`${r}-${c}`} cx={68 + c * 25} cy={68 + r * 25} r="6" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" />
                        )))}
                        <rect x="200" y="40" width="115" height="120" rx="8" fill="var(--card)" stroke="var(--ink)" strokeWidth="2.5" />
                        <text x="257" y="30" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 13, fontWeight: 700 }}>Gas (Steam)</text>
                        <circle cx="220" cy="65" r="6" fill="var(--spark)" stroke="var(--ink)" strokeWidth="2" />
                        <circle cx="290" cy="90" r="6" fill="var(--spark)" stroke="var(--ink)" strokeWidth="2" />
                        <circle cx="235" cy="130" r="6" fill="var(--spark)" stroke="var(--ink)" strokeWidth="2" />
                        <circle cx="280" cy="140" r="6" fill="var(--spark)" stroke="var(--ink)" strokeWidth="2" />
                      </svg>
                    </div>
                  </Stage>
                ) : topicId === "numberline" ? (
                  <Stage
                    title="Direction on the Number Line"
                    readout="Right moves positive (+). Left moves negative (-)."
                    actionLabel="I see the jumps →"
                    onActionClick={() => handleStepChange(1)}
                  >
                    <div className="steepness-demo-stage">
                      <svg viewBox="0 0 360 200" width="100%" height="200">
                        <line x1="30" y1="120" x2="330" y2="120" stroke="var(--ink)" strokeWidth="4" />
                        {[-3, -2, -1, 0, 1, 2, 3].map((val, idx) => (
                          <g key={val}>
                            <line x1={50 + idx * 40} y1={110} x2={50 + idx * 40} y2={130} stroke="var(--ink)" strokeWidth="3" />
                            <text x={50 + idx * 40} y={150} textAnchor="middle" fill="var(--ink)" style={{ fontSize: 13, fontWeight: 700 }}>{val}</text>
                          </g>
                        ))}
                        <path d="M 170 110 Q 210 70 250 110" fill="none" stroke="var(--got-it)" strokeWidth="3.5" strokeDasharray="4 2" />
                        <text x="210" y="60" textAnchor="middle" fill="var(--got-it)" style={{ fontSize: 13, fontWeight: 800 }}>+2 Right</text>
                      </svg>
                    </div>
                  </Stage>
                ) : topicId === "systems" ? (
                  <Stage
                    title="Where Two Paths Cross: Systems"
                    readout="Two linear equations meet at a single intersection point (1, 3)."
                    actionLabel="I see the crossing →"
                    onActionClick={() => handleStepChange(1)}
                  >
                    <div className="steepness-demo-stage">
                      <svg viewBox="0 0 360 200" width="100%" height="200">
                        <line x1="50" y1="160" x2="310" y2="40" stroke="var(--sky)" strokeWidth="5" strokeLinecap="round" />
                        <line x1="50" y1="50" x2="310" y2="160" stroke="var(--ink-muted)" strokeWidth="3.5" strokeDasharray="6 3" strokeLinecap="round" />
                        <circle cx="180" cy="100" r="8" fill="var(--spark)" stroke="var(--ink)" strokeWidth="3" />
                        <text x="180" y="80" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 14, fontWeight: 800 }}>(1, 3) Meeting Point</text>
                      </svg>
                    </div>
                  </Stage>
                ) : (
                  <Stage
                    title="What is steepness? Compare the slopes"
                    readout={
                      hillSteepness === "flat"
                        ? "Flat ground: 0 climb for every step right."
                        : hillSteepness === "gentle"
                        ? "Gentle ramp: climb 1 unit for every 2 steps forward."
                        : "Steep hill: climb 3 units for every 1 step forward."
                    }
                    actionLabel="I see the idea →"
                    onActionClick={() => handleStepChange(1)}
                  >
                    <div className="steepness-demo-stage">
                      <svg viewBox="0 0 360 200" width="100%" height="200" className="hill-svg">
                        <line x1="20" y1="170" x2="340" y2="170" stroke="var(--ink)" strokeWidth="3" />
                        {hillSteepness === "flat" && (
                          <line x1="40" y1="170" x2="320" y2="170" stroke="var(--sky)" strokeWidth="6" strokeLinecap="round" />
                        )}
                        {hillSteepness === "gentle" && (
                          <g>
                            <polygon points="40,170 320,170 320,110" fill="var(--sky-soft)" />
                            <line x1="40" y1="170" x2="320" y2="110" stroke="var(--sky)" strokeWidth="6" strokeLinecap="round" />
                            <text x="180" y="130" fill="var(--ink)" style={{ fontSize: 13, fontWeight: 700 }}>+1 up / +2 right</text>
                          </g>
                        )}
                        {hillSteepness === "steep" && (
                          <g>
                            <polygon points="40,170 320,170 320,30" fill="var(--sky-soft)" />
                            <line x1="40" y1="170" x2="320" y2="30" stroke="var(--sky)" strokeWidth="6" strokeLinecap="round" />
                            <text x="170" y="80" fill="var(--ink)" style={{ fontSize: 13, fontWeight: 700 }}>+3 up / +1 right (Steep!)</text>
                          </g>
                        )}
                      </svg>

                      <div className="hill-selector-chips">
                        <button
                          type="button"
                          className={`btn btn-outline ${hillSteepness === "flat" ? "active-hill" : ""}`}
                          onClick={() => setHillSteepness("flat")}
                        >
                          Flat (0)
                        </button>
                        <button
                          type="button"
                          className={`btn btn-outline ${hillSteepness === "gentle" ? "active-hill" : ""}`}
                          onClick={() => setHillSteepness("gentle")}
                        >
                          Gentle (1/2)
                        </button>
                        <button
                          type="button"
                          className={`btn btn-outline ${hillSteepness === "steep" ? "active-hill" : ""}`}
                          onClick={() => setHillSteepness("steep")}
                        >
                          Steep (3)
                        </button>
                      </div>
                    </div>
                  </Stage>
                )
              )}

              {/* STEP 1: WHY (Understanding the cause) */}
              {currentStepIndex === 1 && (
                topicId === "balance" ? (
                  <Stage
                    title="Why do we do the same operation to both sides?"
                    readout="Adding or taking away from only one side tips the seesaw. Equal change keeps it level."
                    actionLabel="Show me the scale →"
                    onActionClick={() => handleStepChange(2)}
                  >
                    <div className="steepness-demo-stage">
                      <svg viewBox="0 0 360 200" width="100%" height="200">
                        <polygon points="180,140 160,180 200,180" fill="var(--card)" stroke="var(--ink)" strokeWidth="3" />
                        <line x1="40" y1="110" x2="320" y2="170" stroke="var(--not-yet)" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="180" cy="140" r="6" fill="var(--not-yet)" stroke="var(--ink)" strokeWidth="2" />
                        <text x="180" y="60" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 14, fontWeight: 800 }}>Only adding to one pan tips the equation!</text>
                      </svg>
                    </div>
                  </Stage>
                ) : topicId === "fractions" ? (
                  <Stage
                    title="Why larger denominators make smaller slices"
                    readout="Sharing a pizza with 8 friends leaves smaller individual slices than sharing with 4."
                    actionLabel="Show me the bars →"
                    onActionClick={() => handleStepChange(2)}
                  >
                    <div className="steepness-demo-stage">
                      <svg viewBox="0 0 360 200" width="100%" height="200">
                        <circle cx="110" cy="95" r="50" fill="var(--sky-soft)" stroke="var(--ink)" strokeWidth="3" />
                        <line x1="110" y1="45" x2="110" y2="145" stroke="var(--ink)" strokeWidth="2.5" />
                        <line x1="60" y1="95" x2="160" y2="95" stroke="var(--ink)" strokeWidth="2.5" />
                        <text x="110" y="170" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 13, fontWeight: 700 }}>4 pieces: Big slices</text>

                        <circle cx="250" cy="95" r="50" fill="var(--not-yet-soft)" stroke="var(--ink)" strokeWidth="3" />
                        <line x1="250" y1="45" x2="250" y2="145" stroke="var(--ink)" strokeWidth="2" />
                        <line x1="200" y1="95" x2="300" y2="95" stroke="var(--ink)" strokeWidth="2" />
                        <line x1="215" y1="60" x2="285" y2="130" stroke="var(--ink)" strokeWidth="2" />
                        <line x1="215" y1="130" x2="285" y2="60" stroke="var(--ink)" strokeWidth="2" />
                        <text x="250" y="170" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 13, fontWeight: 700 }}>8 pieces: Smaller slices</text>
                      </svg>
                    </div>
                  </Stage>
                ) : topicId === "particles" ? (
                  <Stage
                    title="Why heat causes state transitions"
                    readout="Adding heat gives particles kinetic energy to break bonds and flow freely."
                    actionLabel="Open the simulation →"
                    onActionClick={() => handleStepChange(2)}
                  >
                    <div className="steepness-demo-stage">
                      <svg viewBox="0 0 360 200" width="100%" height="200">
                        <text x="180" y="55" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 15, fontWeight: 800 }}>Heat = Kinetic Speed</text>
                        <line x1="50" y1="110" x2="310" y2="110" stroke="var(--spark)" strokeWidth="6" strokeLinecap="round" />
                        <text x="60" y="140" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 12, fontWeight: 700 }}>Cold (Solid)</text>
                        <text x="180" y="140" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 12, fontWeight: 700 }}>Warm (Liquid)</text>
                        <text x="300" y="140" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 12, fontWeight: 700 }}>Hot (Gas)</text>
                      </svg>
                    </div>
                  </Stage>
                ) : topicId === "numberline" ? (
                  <Stage
                    title="Why negative numbers move to the left"
                    readout="Every backward jump decreases your quantity further below zero."
                    actionLabel="Try jumping →"
                    onActionClick={() => handleStepChange(2)}
                  >
                    <div className="steepness-demo-stage">
                      <svg viewBox="0 0 360 200" width="100%" height="200">
                        <line x1="30" y1="110" x2="330" y2="110" stroke="var(--ink)" strokeWidth="4" />
                        <line x1="180" y1="95" x2="180" y2="125" stroke="var(--ink)" strokeWidth="4" />
                        <text x="180" y="145" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 14, fontWeight: 800 }}>0 (Zero)</text>
                        <text x="90" y="80" textAnchor="middle" fill="var(--not-yet)" style={{ fontSize: 13, fontWeight: 800 }}>← Negative (Smaller)</text>
                        <text x="270" y="80" textAnchor="middle" fill="var(--got-it)" style={{ fontSize: 13, fontWeight: 800 }}>Positive (Larger) →</text>
                      </svg>
                    </div>
                  </Stage>
                ) : topicId === "systems" ? (
                  <Stage
                    title="Why the meeting point solves both equations"
                    readout="Any other point is on one line or neither. Only (1, 3) satisfies both lines simultaneously."
                    actionLabel="Show me the picture →"
                    onActionClick={() => handleStepChange(2)}
                  >
                    <div className="steepness-demo-stage">
                      <svg viewBox="0 0 360 200" width="100%" height="200">
                        <line x1="40" y1="160" x2="320" y2="40" stroke="var(--sky)" strokeWidth="5" strokeLinecap="round" />
                        <line x1="40" y1="40" x2="320" y2="160" stroke="var(--ink-muted)" strokeWidth="3" strokeDasharray="5 3" strokeLinecap="round" />
                        <circle cx="180" cy="100" r="7" fill="var(--spark)" stroke="var(--ink)" strokeWidth="2.5" />
                        <text x="180" y="80" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 13, fontWeight: 800 }}>Both lines true at (1, 3)</text>
                      </svg>
                    </div>
                  </Stage>
                ) : (
                  <Stage
                    title="Why does a negative slope go down?"
                    readout={
                      directionMode === "uphill"
                        ? "Uphill (+): each step right adds height."
                        : "Downhill (-): each step right loses height."
                    }
                    actionLabel="Show me the picture →"
                    onActionClick={() => handleStepChange(2)}
                  >
                    <div className="why-direction-stage">
                      <svg viewBox="0 0 360 200" width="100%" height="200">
                        <line x1="20" y1="170" x2="340" y2="170" stroke="var(--ink)" strokeWidth="3" />
                        {directionMode === "downhill" ? (
                          <g>
                            <polygon points="40,40 320,170 40,170" fill="var(--not-yet-soft)" />
                            <line x1="40" y1="40" x2="320" y2="170" stroke="var(--not-yet)" strokeWidth="6" strokeLinecap="round" />
                            <text x="180" y="100" fill="var(--ink)" style={{ fontSize: 13, fontWeight: 700 }}>Going Down: -2 each step right</text>
                          </g>
                        ) : (
                          <g>
                            <polygon points="40,170 320,40 320,170" fill="var(--got-it-soft)" />
                            <line x1="40" y1="170" x2="320" y2="40" stroke="var(--got-it)" strokeWidth="6" strokeLinecap="round" />
                            <text x="180" y="100" fill="var(--ink)" style={{ fontSize: 13, fontWeight: 700 }}>Going Up: +2 each step right</text>
                          </g>
                        )}
                      </svg>

                      <div className="direction-toggle-row">
                        <button
                          type="button"
                          className={`btn btn-outline ${directionMode === "downhill" ? "active-hill" : ""}`}
                          onClick={() => setDirectionMode("downhill")}
                        >
                          Downhill (- slope)
                        </button>
                        <button
                          type="button"
                          className={`btn btn-outline ${directionMode === "uphill" ? "active-hill" : ""}`}
                          onClick={() => setDirectionMode("uphill")}
                        >
                          Uphill (+ slope)
                        </button>
                      </div>
                    </div>
                  </Stage>
                )
              )}

              {/* STEP 2: PICTURE (Interactive Primitive) */}
              {currentStepIndex === 2 && (
                topicId === "balance" ? (
                  <BalanceScale onHint={() => setShowHintLadder(true)} />
                ) : topicId === "numberline" ? (
                  <NumberLine onHint={() => setShowHintLadder(true)} />
                ) : topicId === "fractions" ? (
                  <FractionBars onHint={() => setShowHintLadder(true)} />
                ) : topicId === "particles" ? (
                  <ParticleBox onHint={() => setShowHintLadder(true)} />
                ) : topicId === "systems" ? (
                  <CoordinatePlane
                    title="Slide m and b to meet target line at (1, 3)"
                    targetM={2}
                    targetB={1}
                    secondaryLine={{ m: -1, b: 4, label: "y = -x + 4" }}
                    onCheck={(_m, _b, correct) => handlePrimitiveCheck(_m, _b, correct)}
                    onHint={() => setShowHintLadder(true)}
                  />
                ) : (
                  <CoordinatePlane
                    title="Slide m to see steepness change"
                    targetM={2}
                    targetB={1}
                    onCheck={(_m, _b, correct) => handlePrimitiveCheck(_m, _b, correct)}
                    onHint={() => setShowHintLadder(true)}
                  />
                )
              )}

              {/* STEP 3: VIDEO (Synchronized live narrated whiteboard) */}
              {currentStepIndex === 3 && (
                <Whiteboard isMuted={isMuted} onClose={() => setIsCanvasOpen(false)} />
              )}

              {/* STEP 4: CHECK (Check for understanding with hint ladder & feedback) */}
              {currentStepIndex === 4 && (
                <Stage
                  title={
                    topicId === "balance"
                      ? "Check understanding: Solve for mystery x"
                      : topicId === "fractions"
                      ? "Check understanding: Equivalent fractions"
                      : topicId === "particles"
                      ? "Check understanding: Thermal kinetic energy"
                      : topicId === "numberline"
                      ? "Check understanding: Number line jump"
                      : topicId === "systems"
                      ? "Check understanding: Meeting point"
                      : "Check understanding: Rise over Run"
                  }
                  readout={
                    topicId === "balance"
                      ? "If 2x = 6, what is x?"
                      : topicId === "fractions"
                      ? "How many eighths make 1/2 of the whole?"
                      : topicId === "particles"
                      ? "Which state has particles moving fastest? (Solid, Liquid, or Gas)"
                      : topicId === "numberline"
                      ? "Start at 2 and jump -5. Where do you land?"
                      : topicId === "systems"
                      ? "Both equations intersect at (1, 3)"
                      : "Rise = 4, Run = 2. What is the slope?"
                  }
                  onHintClick={() => setShowHintLadder(true)}
                  actionLabel="I'm ready for practice →"
                  onActionClick={() => handleStepChange(5)}
                >
                  <div className="check-question-stage">
                    <svg viewBox="0 0 300 180" width="100%" height="180">
                      {topicId === "balance" ? (
                        <g>
                          <polygon points="150,130 130,165 170,165" fill="var(--card)" stroke="var(--ink)" strokeWidth="3" />
                          <line x1="50" y1="130" x2="250" y2="130" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
                          <circle cx="150" cy="130" r="5" fill="var(--spark)" stroke="var(--ink)" strokeWidth="2" />
                          <rect x="60" y="90" width="50" height="35" rx="6" fill="var(--sky-soft)" stroke="var(--ink)" strokeWidth="2" />
                          <text x="85" y="113" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 14, fontWeight: 800 }}>2x</text>
                          <text x="150" y="100" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 22, fontWeight: 900 }}>=</text>
                          <rect x="190" y="90" width="50" height="35" rx="6" fill="var(--got-it-soft)" stroke="var(--ink)" strokeWidth="2" />
                          <text x="215" y="113" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 14, fontWeight: 800 }}>6</text>
                        </g>
                      ) : topicId === "systems" ? (
                        <g>
                          <line x1="40" y1="150" x2="260" y2="30" stroke="var(--sky)" strokeWidth="4" />
                          <line x1="40" y1="40" x2="260" y2="150" stroke="var(--ink-muted)" strokeWidth="3" strokeDasharray="5 3" />
                          <circle cx="150" cy="95" r="7" fill="var(--spark)" stroke="var(--ink)" strokeWidth="2.5" />
                          <text x="165" y="90" fill="var(--ink)" style={{ fontSize: 13, fontWeight: 700 }}>Intersection (1, 3)</text>
                        </g>
                      ) : (
                        <g>
                          <line x1="40" y1="140" x2="260" y2="140" stroke="var(--ink)" strokeWidth="2" />
                          <line x1="40" y1="140" x2="200" y2="140" stroke="var(--ink)" strokeWidth="3" strokeDasharray="4 2" />
                          <line x1="200" y1="140" x2="200" y2="40" stroke="var(--ink)" strokeWidth="3" strokeDasharray="4 2" />
                          <line x1="40" y1="140" x2="200" y2="40" stroke="var(--sky)" strokeWidth="5" strokeLinecap="round" />
                          <text x="120" y="160" fill="var(--ink)" style={{ fontSize: 13, fontWeight: 700 }}>run = 2</text>
                          <text x="220" y="90" fill="var(--ink)" style={{ fontSize: 13, fontWeight: 700 }}>rise = 4</text>
                        </g>
                      )}
                    </svg>
                    <p className="check-prompt-text">
                      Type your answer below in the chat or say it out loud!
                    </p>
                  </div>
                </Stage>
              )}

              {/* STEP 5: PRACTICE (Solidifying mastery - Single clear challenge) */}
              {currentStepIndex === 5 && (
                topicId === "balance" ? (
                  <BalanceScale
                    onHint={() => setShowHintLadder(true)}
                    onCheck={(_x, isCorrect) => {
                      if (isCorrect) {
                        playGotItSound(isMuted);
                        setFeedback({ type: "got-it", message: "You balanced the equation 2x + 3 = 7 with x = 2!" });
                        setTimeout(() => onMasteryReached?.(), 1200);
                      } else {
                        playNotYetSound(isMuted);
                        setFeedback({ type: "not-yet", message: "Not balanced yet. Subtract 3 from 7 to get 2x = 4, so what is x?" });
                      }
                    }}
                  />
                ) : topicId === "fractions" ? (
                  <FractionBars
                    onHint={() => setShowHintLadder(true)}
                    onCheck={(_t, _b, isCorrect) => {
                      if (isCorrect) {
                        playGotItSound(isMuted);
                        setFeedback({ type: "got-it", message: "Both fraction pieces are shaded!" });
                        setTimeout(() => onMasteryReached?.(), 1200);
                      }
                    }}
                  />
                ) : topicId === "particles" ? (
                  <ParticleBox onHint={() => setShowHintLadder(true)} />
                ) : topicId === "numberline" ? (
                  <NumberLine
                    target={3}
                    title="Slide the dot to 3"
                    onHint={() => setShowHintLadder(true)}
                    onCheck={(_val, isCorrect) => {
                      if (isCorrect) {
                        playGotItSound(isMuted);
                        setFeedback({ type: "got-it", message: "You landed right on 3!" });
                        setTimeout(() => onMasteryReached?.(), 1200);
                      } else {
                        playNotYetSound(isMuted);
                        setFeedback({ type: "not-yet", message: "Keep sliding the dot until you land on 3." });
                      }
                    }}
                  />
                ) : topicId === "systems" ? (
                  <CoordinatePlane
                    title="Find where your line meets y = -x + 4 at (1, 3)"
                    targetM={2}
                    targetB={1}
                    secondaryLine={{ m: -1, b: 4, label: "y = -x + 4" }}
                    onCheck={(_m, _b, correct) => {
                      handlePrimitiveCheck(_m, _b, correct);
                      if (correct) {
                        setTimeout(() => onMasteryReached?.(), 1200);
                      }
                    }}
                    onHint={() => setShowHintLadder(true)}
                  />
                ) : (
                  <CoordinatePlane
                    title="Plot slope 2 and start at 1"
                    targetM={2}
                    targetB={1}
                    onCheck={(_m, _b, correct) => {
                      handlePrimitiveCheck(_m, _b, correct);
                      if (correct) {
                        setTimeout(() => onMasteryReached?.(), 1200);
                      }
                    }}
                    onHint={() => setShowHintLadder(true)}
                  />
                )
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
