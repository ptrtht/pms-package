export function makeInterceptable<T extends new (...args: any[]) => any>(
  BaseClass: T,
  interceptor: (
      methodName: string | symbol,
      args: any[],
      method: Function,
      instance: InstanceType<T> & { promptable_api_key?: string }  // Add the new property type
  ) => any
) {
  return class extends BaseClass {
      promptable_api_key?: string;  // Declare the new property

      constructor(...args: any[]) {
          super(...args);
          
          const wrapValue = (value: any, instance: any = this): any => {
              if (!value || typeof value !== 'object') return value;
              
              return new Proxy(value, {
                  get(target: any, prop: string | symbol, receiver: any) {
                      const propValue = Reflect.get(target, prop, receiver);
                      
                      if (typeof propValue === 'function' && prop !== 'constructor') {
                          return async function(...args: any[]) {
                              const method = async () => propValue.apply(target, args);
                              return interceptor(prop, args, method, instance);
                          };
                      }
                      
                      return wrapValue(propValue, instance);
                  }
              });
          };

          return wrapValue(this);
      }
  };
}
