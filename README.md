Neverwinter Nights
===================
> Combat simulator

This simulator is a small preview of the combat system found in the popular game called "Neverwinter Nights". It is based on D&D's 3.5 edition rules.

Sim includes only basic combat core. I've tried to keep consistency rules regarding ability modifiers, attack bonuses, critical hits and damage as much as I could, but I had to modify some of them.

Basic principle is this:

- Round duration is dependant on the total number of combatants' attacks.
- On the start of each round's attack, a random dice of 1 or 0 determines the attacker.
- Each attack attacker rolls for the hit chance (0/critical miss, 20/critical hit).
- Critical hit represents certain hit and damage is doubled.
- If the rolled attack bonus is over opponent's AC (armor class), a hit is made.
- In case of normal hit, dice is rolled for damage dealt, which reduces opponent's current health.
- Damage accounted is pure physical damage.
- Round will loop until one of the combatants' HP falls below zero.

[Live preview](http://davidlazic.github.io/nwn-fight-simulator/)
