## Introduction

People often donate money to support charitable actions but it is hard to ensure the money is sent and stored securely as third-parties must be trusted in the process. Also, donating money is usually a redundant process in which donors do not feel engaged.

At SpaceTombo, we believe donating money to charitable organizations should be a playful and rewarding process wrapped in a secure and transparent ecosystem.

Leveraging blockchain technologies allows us to propose a new paradigm for donors, offering a modern way to donate while also engaging in a thrilling adventure. The aim is to bring gamification to donation mechanics via an event-based on-chain lottery.

Ultimately, we want to shape a new standard for lotteries in the modern world. This standard allows charitable organizations and donors to engage in a lucrative process that benefits both parties, while keeping a primary focus on helping organizations fighting for important causes.

## What it does

By purchasing lottery tickets, buyers become donors as 100% of ticket revenues will be sent to the charitable organization specified at lottery creation. The trick is that the lottery ticket also provides a special NFT to donors and automatically registers them as potential winners of lottery prizes. The given NFT is dynamic. It evolves through lottery events.

## How we built it

The lottery rules, funds, mechanics are handed to an open source smart contract. The security of public blockchains enforces that the money raised by contributors can’t be diverted. \
Our first blockchain of choice is Polygon, a PoS sidechain on the Ethereum network. We chose this public blockchain for its reliability and low fees.

The following principles are ensured by the oracle networks:

- The lottery events are triggered by Chainlink Keepers (coming in V2)
- The equal chance of winning prizes is ensured by Chainlink VRF
- The minimum contribution price remains stable using Chainlink Data Feeds

## Lottery

A lottery is a form of gambling that involves the drawing of numbers at random for prizes.

To make this game system virtuous, the lottery smart contract is deployed on-chain with immutable parameters. Consequently, the ticket entry price, the address of the charitable organization’s wallet, the events, the participation periods, and all other lottery parameters remain constant and verifiable. This way all potential donors can verify the lottery’s legitimacy before any commitment is made.

After its creation, triggering lottery events is governed by the network and the Chainlink oracles.

### Tickets

To participate in the lottery, donors purchase tickets and get an NFT as a reward. The ticket has a fixed price in USD.  
The price is verified on-chain using Chainlink Data Feeds.

### Events

The lottery takes place through different events that allow its proper functioning:

1. Smart contract deployment with its immutable parameters

2. Funding of the lottery with LINKs for Chainlink computation

3. Participation period :
   This period allows people to mint their own customisable NFT. Minting requires paying a lottery entry price and provides a ticket for the lottery tied to their wallet address. 100% of the funds donated during the participation period are handed to the earth pool.

4. Preparation period :
   Participants have the possibility to upgrade their NFT before the event. They can not mint new ones. Upgrading allows adding funds to the moon pool (coming in V2).

5. Events:
   Events will gradually alter NFTs (change the IPFS image of the token). Only three NFTs will remain pristine (winners).

6. Release of the funds:
   The contract will release the funds from the pools to the charitable organization and the participants at the end of the last event.

## Fund pools

### Earth pool

The earth pool contains funds 100% dedicated to the charitable organization.

### Moon pool (coming in V2)

The moon pool contains funds dedicated to the charitable organization, donors, lottery creators.

## Future of SpaceTombo

## What's next for SpaceTombo - NFT Charitable Lotteries

### Association Approval Protocol

Working on a protocol for selecting and approving associations is essential to avoid abuse and litigation. We will set up a program to allow organizations to nominate and verify their eligibility, commitment and actions. The legal framework for donations may vary depending on the country and government in which the donation is made. A supervision and an accompaniment will be necessary until the delivery of the funds. We will try to be as transparent as possible about the purpose of the donation.

### Governance

We want to implement a governance principle to select the association for each season/drawing. NFT holders will then be able to claim a certain number of votes to support the cause of their choice. At that time, a voting period will be instituted. This is intended to make our donations more democratic, while empowering every ticket holder.

### GameFi

We have already thought about the value we could bring to the NFTs (spaceship and destroyed spaceship) beyond the donations they will generate. We want to develop an economy around them while promoting the growth of donations through the GameFI aspect. For example a retro video game playable with spaceships, probably a kind of Space Invader, themselves being lottery tickets. Concerning the utility of the destroyed ships, they could be used to craft new ships to participate again in the lottery or to use them in the game.
