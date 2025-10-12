import type {Class} from '@/types.ts';

export default function CanBeRecycled<TBase extends Class>(base: TBase) {
    return class CanBeRecycledTrait extends base {
        public dead: boolean = false;

        public recycle<K extends keyof this>(props: Record<K, this[K]>): void {
            for (const [key, val] of Object.entries(props)) {
                if (key in this && typeof (this as any)[key] === typeof val) {
                    (this as any)[key] = val;
                }
            }
        }
    };
}