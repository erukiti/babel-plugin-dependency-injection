"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babylon_1 = require("babylon");
const WasCreated = Symbol('WasCreated');
const plugin = ({ types: t, template, version }) => {
    const visitor = {
        Program: {
            exit: (nodePath, state) => {
                if (state.inserters.last) {
                    const newAst = template(state.inserters.last)();
                    nodePath.pushContainer('body', newAst);
                }
            },
        },
        VariableDeclarator: (nodePath, state) => {
            const { kind } = nodePath.parent;
            if (t.isIdentifier(nodePath.node.id)) {
                const replaceCode = state.replacers[`${kind} ${nodePath.node.id.name} =`];
                if (replaceCode) {
                    const newAst = babylon_1.parseExpression(replaceCode);
                    nodePath.get('init').replaceWith(newAst);
                }
            }
        },
        'FunctionDeclaration|ClassDeclaration': (nodePath, state) => {
            if (nodePath[WasCreated] || !t.isIdentifier(nodePath.node.id)) {
                return;
            }
            const optId = {
                FunctionDeclaration: 'function',
                ClassDeclaration: 'class',
            };
            const replaceCode = state.replacers[`${optId[nodePath.type]} ${nodePath.node.id.name}`];
            if (replaceCode) {
                const newAst = template(replaceCode)();
                nodePath.replaceWith(newAst);
                nodePath[WasCreated] = true;
            }
        },
    };
    return {
        name: 'dependency-injection',
        visitor,
        pre() {
            const opts = this.opts[this.file.opts.filename];
            if (opts) {
                this.inserters = Object.assign({}, opts.insert);
                this.replacers = Object.assign({}, opts.replace);
            }
            else {
                this.inserters = {};
                this.replacers = {};
            }
        },
    };
};
module.exports = plugin;
//# sourceMappingURL=index.js.map