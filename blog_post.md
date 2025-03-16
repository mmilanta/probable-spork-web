# Blog post

## The Paradox of Federer’s Success

Roger Federer, one of the most successful tennis players in history, once mentioned in a speech that he won only about **54% of the points** he played. This statement appears paradoxical—how can a player with such a slim margin of superiority dominate the sport? The answer lies in the **amplification effect** of match structure, where small advantages compound to create significant outcomes.

## Example of a 2 points tiebreaker

Let's make a concrete example. Alex is playing against Bob, and Alex has a probability $p$ of beating Bob in a single point. $p = 0.5$ would mean that Alex is just as strong as Bob, $p>0.5$ that Alex is stronger, and $p < 0.5$, that Bob is stronger.

Now we look at a 2 points tiebreaker (which we indicate as $\T_2$). I.e. the first player to win two points wins the match. We are interested, in the probability of Alex to win this $\T_2$. For alex to win, one of the following must happen:

* Alex wins the first two points: probability $p^2$.
* Alex wins the first point, loses the second, but wins the third: probability $p(1-p)p$.
* Alex loses the first point, but wins the second and third: probability $(1-p)p^2$.

So overall, we have that
$$
\newcommand{\w}{\text{Win}}
\newcommand{\l}{\text{Lose}}
\newcommand{\tiebreak}{\text{Tiebreak}}
\newcommand{\M}{\mathcal{M}}
\newcommand{\p}{\mathcal{P}}
\newcommand{\pl}{\text{Player}}
\newcommand{\eff}{\mathcal{E}}
\newcommand{\L}{\mathcal{L}}
\newcommand{\T}{\mathcal{T}}
\newcommand{\F}{\mathcal{F}}
\newcommand{\E}{\mathcal{E}}
\p(p, \T_2) = p^2 + p(1-p)p + (1-p)p^2 = 3p^2-2p^3,
$$
where we define $\p(p, \T_2)$ to be the probability of Alex to win $\T_2$. Plugging in $p=0.54$ like in Federer case, for a 2 point tiebreaker, we get $\p(0.54, \T_2) = 0.559872$.

## N-point tiebreaker

Going beyond $\T_2$, to $\T_3, \T_4, ...$ the maths becomes messy very quickly. For this reason I made a python library that allows us to compute $\p(p, \T)$ for any arbitrary $\T$. In Figure 1, you can see $\p(p, \T_n)$, where $n$ can be selected through a slider.

## Fairness

It is clear, that $\T_7$ will be more "fair" than $\T_2$. Meaning that the stronger player will have more edge. To quantify this "Fairness", we look at the steepness of the line tangent to $\p(p, \T)$, with $p = 0.5$. This is the steepness of the dashed line in Figure 1. For those of you which have notions of calculus,
$$
\F(\T) := \frac{d}{dp}\p(p, \T)\bigg|_{p=0.5}.
$$
The intuiton is that, let's say Alex is slightly stronger than Bob, i.e, $p = 0.5 + \epsilon$. Where $\epsilon$ is a small margin. Then, by Taylor series, $\p(0.5 + \epsilon, \T) \simeq 0.5 + \F(\T)\epsilon$.  Thus the margin has been amplified by a factor $\F(\T)$.

## Match Length

While making a match longer amplifies the advantage of the stronger player, there is a trade-off: matches cannot last forever. Thus we also want to evaluate a match structure $\T$, based on how long will it take to play it.

As many tennis structures can last forever, i.e. tennis tie-breakes with advantages, I decided to evaluate the expected value of the number of points played. We define it as $\E(p, \T)$. Our python library, luckily also takes care of it. Thus we can look at $\E(p, \T)$ for tie-breakers in Figure2.

## The Tradeoff

In figure3, we plot $\E(0.5, \T)$ against $\F(\T)$. We can see, how matches become more efficent, they also become longer. The question that now rise naturally is, how does the real Tennis game strucure compare? You can see it as the red dot in Figure 3. My intuition would have been that the complicated structure, which is there because of tradition, is worse than just a very long tiebreaker, but, I was wrong. It is indeed better.

This motivated to look for game structure which are even more efficient. After some time I found one that is even better than the Tennis match structure. Indeed, I actually believe that is even optimal. My game structure is parametric, and it achieves the bound:
$$
\F(\T) = \E(0.5, \T) ^2.
$$
However, I didn't manage to prove that this is optimal! I challenge anybody to come up with a better solution, or to prove that this is optimal. I am happy to give out a prize of 1000$ for anybody that manages.
