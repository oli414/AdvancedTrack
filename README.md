# Advanced Track
Advanced Track is a plugin that allows users to setup ride controllers to influence the course of the ride. In practice this allows you to create 
dual loading stations, switching tracks, drop tracks, lifts and much more!

## Features
Advanced Track works by adding "track features" in the Advanced Track window, which can be found as an option under the map toolbar button.

### Control System
A flexible setup that allows you to select an action which is executed when a selected trigger is triggered.

Most of the triggers and action are location based, meaning that they affect the track piece at the specified location.

**Triggers:**
- Ride Train Sensors, triggers when a vehicle from the ride that this control system is part of enters, or exits the specified tile.

**Actions:**
- Set the brake speed.
- Set the booster speed.
- Open/close a block brake.
- Enable/disable chainlift for a track piece.
- Set the chain lift speed of a ride.
- Cycle the order that the track pieces are in (track switching).

### Lift/Drop Track
Stops a train at a given location, and either moves the track and train up or down to another level. The train is dispatched at the new height. This feature 
essentially allows you to create lifts, or drop tracks which are elements that some real life rides feature.

You specify the position where the front of the train is meant to stop. The affected track pieces are automatically calculated depending on the train length. 
This feature is intended for straight (non-diagonal) sections of track.

## Installation
Download the latest `AdvancedTrack.js` file from the releases page:
https://github.com/oli414/AdvancedTrack/releases/
And place it in `OpenRCT2/plugin`, you can now access the tools via the map toolbar.

## Limitations
You may be required to use an alternative operation mode in order to open your ride if it doesn't make a full circuit due to track switches/lifts. For block brakes to continue to fuction you can either use a control system to control the block brakes, or create an invisible track to connect dead ends together for 
the game to find the block brakes.

Advanced Track works on a per tile basis, this may require extra attention when tracks overlap. For track related operations, Advanced Track will look at the 
bottom most track piece (of any ride) in the order that is shown in the tile inspector.

Currently Advanced Track does not work in multiplayer.

People that download your park featuring Advanced Track functionality will need to have Advanced Track installed as well in order to see everything operating 
as intended. Advanced Track simply won't operate without it, which may cause a ride to crash in the worst case scenario. Advise park viewers to install 
Advanced Track, or include a copy of the plugin with the park download.