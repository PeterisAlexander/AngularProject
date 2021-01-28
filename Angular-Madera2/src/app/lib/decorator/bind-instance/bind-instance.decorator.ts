/**
 * Décorateur permettant de bind le contexte (this) automatiquement
 * à la méthode sur laquelle il est appliqué.
 * Utilise un système de cache pour ne pas re-binder à chaque appel.
 */
export function BindInstance() {
    return <Fn extends Function>(
        target: any,
        key: string,
        descriptor: TypedPropertyDescriptor<Fn>
    ): TypedPropertyDescriptor<Fn> => {
        const original = descriptor.value;

        return {
            get(): Fn {
                if (this[`__${key}Binded`] == null) {
                    Object.defineProperty(this, `__${key}Binded`, {
                        value: original.bind(this)
                    });
                }

                return this[`__${key}Binded`];
            }
        };
    };
}
