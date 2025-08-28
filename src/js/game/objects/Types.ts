export interface DamageTaker { takeDamage(damage: number): void }
export const canTakeDamage = (object: Object): object is DamageTaker => 'takeDamage' in object && typeof object.takeDamage === 'function';

export interface DamageProvider { get damage(): number }
export const canProvideDamage = (object: Object): object is DamageProvider => 'damage' in object && typeof object.damage === 'number';

export interface Mortal { get dead(): boolean }